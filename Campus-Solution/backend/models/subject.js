import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // e.g., "CS101", "MATH201"
    description: { type: String },
    department: { type: String, required: true },
    semester: { type: Number, required: true }, // 1-8
    credits: { type: Number, required: true, min: 1, max: 10 },
    
    // Class scheduling details
    weeklyHours: { type: Number, required: true, min: 1 }, // Total hours per week
    lectureHours: { type: Number, default: 0 }, // Theory hours
    labHours: { type: Number, default: 0 }, // Practical hours
    tutorialHours: { type: Number, default: 0 }, // Tutorial/discussion hours
    
    // Course details
    type: { 
      type: String, 
      enum: ['core', 'elective', 'mandatory', 'optional'], 
      default: 'core' 
    },
    category: { 
      type: String, 
      enum: ['theory', 'practical', 'mixed'], 
      default: 'theory' 
    },
    
    // Prerequisites and requirements
    prerequisites: [{ type: String }], // Array of subject codes
    maxStudents: { type: Number, default: 60 },
    minStudents: { type: Number, default: 5 },
    
    // Faculty assignment
    assignedFaculty: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    
    // Academic details
    syllabus: { type: String }, // Course syllabus/outline
    objectives: [{ type: String }], // Learning objectives
    outcomes: [{ type: String }], // Expected learning outcomes
    
    // Assessment details
    assessmentPattern: {
      internal: { type: Number, default: 40 }, // Internal assessment marks
      external: { type: Number, default: 60 }, // External exam marks
      practical: { type: Number, default: 0 }, // Practical assessment marks
    },
    
    // Status and metadata
    isActive: { type: Boolean, default: true },
    academicYear: { type: String, required: true }, // e.g., "2024-25"
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for better performance
subjectSchema.index({ code: 1 });
subjectSchema.index({ department: 1, semester: 1 });
subjectSchema.index({ academicYear: 1, isActive: 1 });

// Virtual for total assessment marks
subjectSchema.virtual('totalMarks').get(function() {
  return this.assessmentPattern.internal + this.assessmentPattern.external + this.assessmentPattern.practical;
});

// Method to check if user can teach this subject
subjectSchema.methods.canBeTeachedBy = function(userId) {
  return this.assignedFaculty.some(facultyId => facultyId.toString() === userId.toString());
};

export default mongoose.model("Subject", subjectSchema);
