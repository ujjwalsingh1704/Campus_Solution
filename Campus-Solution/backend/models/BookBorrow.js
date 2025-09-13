import mongoose from 'mongoose';

const bookBorrowSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerType: {
    type: String,
    required: true,
    enum: ['student', 'faculty']
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    amount: {
      type: Number,
      default: 0
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date,
      default: null
    },
    lateFeeApplied: {
      type: Boolean,
      default: false
    },
    lateFeeAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  renewalCount: {
    type: Number,
    default: 0,
    max: 2 // Maximum 2 renewals allowed
  },
  notes: {
    type: String,
    trim: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate fine automatically
bookBorrowSchema.methods.calculateFine = function() {
  if (this.status === 'returned' || !this.dueDate) return 0;
  
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  
  if (now <= dueDate) return 0;
  
  const overdueDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
  const finePerDay = this.borrowerType === 'student' ? 2 : 5; // ₹2 for students, ₹5 for faculty
  
  let totalFine = overdueDays * finePerDay;
  
  // Apply late fee if fine is overdue for more than 7 days
  const fineOverdueDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)) - 7;
  if (fineOverdueDays > 0 && !this.fine.lateFeeApplied) {
    this.fine.lateFeeAmount = Math.min(fineOverdueDays * 10, 100); // ₹10 per day, max ₹100
    this.fine.lateFeeApplied = true;
    totalFine += this.fine.lateFeeAmount;
  }
  
  this.fine.amount = totalFine - this.fine.lateFeeAmount;
  this.fine.totalAmount = totalFine;
  
  return totalFine;
};

// Update status based on due date
bookBorrowSchema.methods.updateStatus = function() {
  if (this.returnDate) {
    this.status = 'returned';
  } else if (new Date() > this.dueDate) {
    this.status = 'overdue';
    this.calculateFine();
  } else {
    this.status = 'borrowed';
  }
};

// Pre-save middleware to update status and calculate fine
bookBorrowSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

// Index for efficient querying
bookBorrowSchema.index({ borrower: 1, status: 1 });
bookBorrowSchema.index({ book: 1, status: 1 });
bookBorrowSchema.index({ dueDate: 1, status: 1 });
bookBorrowSchema.index({ 'fine.isPaid': 1 });

export default mongoose.model('BookBorrow', bookBorrowSchema);
