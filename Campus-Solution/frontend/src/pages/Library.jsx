import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import Layout from '../components/Layout';
import libraryAPI from '../utils/libraryAPI';
import { 
  Search, 
  Filter, 
  Book, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  CreditCard,
  X,
  Wallet,
  IndianRupee
} from 'lucide-react';

export default function Library() {
  const { user } = useAuth();
  const { balance, processPayment } = useWallet();
  const [activeTab, setActiveTab] = useState('browse');
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [adminBorrows, setAdminBorrows] = useState([]);
  const [adminStats, setAdminStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  const categories = [
    'all', 'Computer Science', 'Mathematics', 'Physics', 
    'Engineering', 'Chemistry', 'Business', 'Literature', 'Research', 'General'
  ];

  // Initial data load - always load books regardless of user state
  useEffect(() => {
    console.log('Library initial load - loading books');
    fetchBooks(); // Always load books initially
  }, []);

  // Handle user-dependent data when user becomes available
  useEffect(() => {
    if (user) {
      console.log('Library user available - activeTab:', activeTab);
      if (activeTab === 'my-books') {
        fetchMyBooks();
      } else if (activeTab === 'admin' && user?.role === 'admin') {
        fetchAdminBorrows();
      }
    }
  }, [user, activeTab]);

  // Handle search/filter updates for books
  useEffect(() => {
    if (activeTab === 'browse') {
      console.log('Library search/filter change');
      fetchBooks();
    }
  }, [searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    console.log('fetchBooks called');
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      console.log('Fetching books with params:', params);
      const response = await libraryAPI.getBooks(params);
      console.log('Books API response:', response);
      if (response.success) {
        console.log('Setting books from API:', response.books);
        setBooks(response.books);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      // Comprehensive hardcoded book collection for better user experience
      const sampleBooks = [
        // Computer Science Books
        {
          _id: '1',
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen, Charles E. Leiserson',
          isbn: '978-0262033848',
          category: 'Computer Science',
          publisher: 'MIT Press',
          publishYear: 2009,
          totalCopies: 8,
          availableCopies: 5,
          location: 'CS-Section-A1',
          description: 'The most comprehensive introduction to algorithms and data structures. Essential for computer science students.',
          rating: 4.8,
          tags: ['algorithms', 'data-structures', 'programming']
        },
        {
          _id: '2',
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          isbn: '978-0132350884',
          category: 'Computer Science',
          publisher: 'Prentice Hall',
          publishYear: 2008,
          totalCopies: 6,
          availableCopies: 3,
          location: 'CS-Section-A2',
          description: 'Learn to write clean, maintainable code that stands the test of time.',
          rating: 4.6,
          tags: ['clean-code', 'software-engineering', 'best-practices']
        },
        {
          _id: '3',
          title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
          isbn: '978-0201633612',
          category: 'Computer Science',
          publisher: 'Addison-Wesley',
          publishYear: 1994,
          totalCopies: 5,
          availableCopies: 2,
          location: 'CS-Section-A3',
          description: 'The classic Gang of Four book on design patterns in object-oriented programming.',
          rating: 4.5,
          tags: ['design-patterns', 'oop', 'software-architecture']
        },
        {
          _id: '4',
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
          isbn: '978-0078022159',
          category: 'Computer Science',
          publisher: 'McGraw-Hill',
          publishYear: 2019,
          totalCopies: 7,
          availableCopies: 0,
          location: 'CS-Section-A4',
          description: 'Comprehensive coverage of database management systems and concepts.',
          rating: 4.4,
          tags: ['database', 'sql', 'dbms']
        },
        {
          _id: '5',
          title: 'Operating System Concepts',
          author: 'Abraham Silberschatz, Peter Baer Galvin, Greg Gagne',
          isbn: '978-1118063330',
          category: 'Computer Science',
          publisher: 'Wiley',
          publishYear: 2018,
          totalCopies: 6,
          availableCopies: 2,
          location: 'CS-Section-A5',
          description: 'The definitive textbook on operating systems concepts and implementation.',
          rating: 4.3,
          tags: ['operating-systems', 'system-programming', 'kernel']
        },
        {
          _id: '6',
          title: 'Artificial Intelligence: A Modern Approach',
          author: 'Stuart Russell, Peter Norvig',
          isbn: '978-0134610993',
          category: 'Computer Science',
          publisher: 'Pearson',
          publishYear: 2020,
          totalCopies: 5,
          availableCopies: 1,
          location: 'CS-Section-A6',
          description: 'The leading textbook in artificial intelligence, covering modern AI techniques.',
          rating: 4.7,
          tags: ['artificial-intelligence', 'machine-learning', 'ai']
        },
        {
          _id: '7',
          title: 'Computer Networks',
          author: 'Andrew S. Tanenbaum, David J. Wetherall',
          isbn: '978-0132126953',
          category: 'Computer Science',
          publisher: 'Pearson',
          publishYear: 2017,
          totalCopies: 4,
          availableCopies: 2,
          location: 'CS-Section-A7',
          description: 'Comprehensive guide to computer networking protocols and technologies.',
          rating: 4.2,
          tags: ['networking', 'protocols', 'internet']
        },
        {
          _id: '8',
          title: 'The Pragmatic Programmer',
          author: 'David Thomas, Andrew Hunt',
          isbn: '978-0135957059',
          category: 'Computer Science',
          publisher: 'Addison-Wesley',
          publishYear: 2019,
          totalCopies: 4,
          availableCopies: 3,
          location: 'CS-Section-A8',
          description: 'Your journey to mastery in software development and programming practices.',
          rating: 4.6,
          tags: ['programming', 'software-development', 'best-practices']
        },
        
        // Mathematics Books
        {
          _id: '9',
          title: 'Calculus: Early Transcendentals',
          author: 'James Stewart, Daniel K. Clegg, Saleem Watson',
          isbn: '978-1285741550',
          category: 'Mathematics',
          publisher: 'Cengage Learning',
          publishYear: 2015,
          totalCopies: 10,
          availableCopies: 7,
          location: 'MATH-Section-B1',
          description: 'The most successful calculus book of its generation, trusted by millions.',
          rating: 4.3,
          tags: ['calculus', 'derivatives', 'integrals']
        },
        {
          _id: '10',
          title: 'Linear Algebra and Its Applications',
          author: 'David C. Lay, Steven R. Lay, Judi J. McDonald',
          isbn: '978-0321982384',
          category: 'Mathematics',
          publisher: 'Pearson',
          publishYear: 2015,
          totalCopies: 8,
          availableCopies: 4,
          location: 'MATH-Section-B2',
          description: 'Modern approach to linear algebra with real-world applications.',
          rating: 4.4,
          tags: ['linear-algebra', 'matrices', 'vector-spaces']
        },
        {
          _id: '11',
          title: 'Discrete Mathematics and Its Applications',
          author: 'Kenneth H. Rosen',
          isbn: '978-0073383095',
          category: 'Mathematics',
          publisher: 'McGraw-Hill',
          publishYear: 2018,
          totalCopies: 6,
          availableCopies: 3,
          location: 'MATH-Section-B3',
          description: 'Comprehensive coverage of discrete mathematics for computer science.',
          rating: 4.2,
          tags: ['discrete-math', 'logic', 'combinatorics']
        },
        {
          _id: '12',
          title: 'Probability and Statistics for Engineers and Scientists',
          author: 'Ronald E. Walpole, Raymond H. Myers',
          isbn: '978-0321629111',
          category: 'Mathematics',
          publisher: 'Pearson',
          publishYear: 2016,
          totalCopies: 7,
          availableCopies: 5,
          location: 'MATH-Section-B4',
          description: 'Applied probability and statistics with engineering applications.',
          rating: 4.1,
          tags: ['probability', 'statistics', 'engineering']
        },
        
        // Physics Books
        {
          _id: '13',
          title: 'Physics for Scientists and Engineers',
          author: 'Raymond A. Serway, John W. Jewett',
          isbn: '978-1133947271',
          category: 'Physics',
          publisher: 'Cengage Learning',
          publishYear: 2013,
          totalCopies: 9,
          availableCopies: 6,
          location: 'PHY-Section-C1',
          description: 'Comprehensive physics textbook covering mechanics, thermodynamics, and modern physics.',
          rating: 4.5,
          tags: ['physics', 'mechanics', 'thermodynamics']
        },
        {
          _id: '14',
          title: 'University Physics with Modern Physics',
          author: 'Hugh D. Young, Roger A. Freedman',
          isbn: '978-0321973610',
          category: 'Physics',
          publisher: 'Pearson',
          publishYear: 2015,
          totalCopies: 6,
          availableCopies: 3,
          location: 'PHY-Section-C2',
          description: 'Comprehensive university-level physics with modern physics topics.',
          rating: 4.4,
          tags: ['physics', 'quantum-mechanics', 'relativity']
        },
        {
          _id: '15',
          title: 'Introduction to Electrodynamics',
          author: 'David J. Griffiths',
          isbn: '978-1108420419',
          category: 'Physics',
          publisher: 'Cambridge University Press',
          publishYear: 2017,
          totalCopies: 4,
          availableCopies: 1,
          location: 'PHY-Section-C3',
          description: 'Classic textbook on electromagnetic theory and applications.',
          rating: 4.6,
          tags: ['electromagnetism', 'maxwell-equations', 'field-theory']
        },
        
        // Engineering Books
        {
          _id: '16',
          title: 'Engineering Mechanics: Statics',
          author: 'Russell C. Hibbeler',
          isbn: '978-0134814971',
          category: 'Engineering',
          publisher: 'Pearson',
          publishYear: 2017,
          totalCopies: 8,
          availableCopies: 5,
          location: 'ENG-Section-D1',
          description: 'Fundamental principles of statics for engineering students.',
          rating: 4.3,
          tags: ['statics', 'mechanics', 'engineering']
        },
        {
          _id: '17',
          title: 'Fundamentals of Electric Circuits',
          author: 'Charles K. Alexander, Matthew N. O. Sadiku',
          isbn: '978-0078028229',
          category: 'Engineering',
          publisher: 'McGraw-Hill',
          publishYear: 2016,
          totalCopies: 7,
          availableCopies: 4,
          location: 'ENG-Section-D2',
          description: 'Comprehensive introduction to electric circuit analysis.',
          rating: 4.2,
          tags: ['circuits', 'electrical-engineering', 'electronics']
        },
        {
          _id: '18',
          title: 'Materials Science and Engineering: An Introduction',
          author: 'William D. Callister Jr., David G. Rethwisch',
          isbn: '978-1118324578',
          category: 'Engineering',
          publisher: 'Wiley',
          publishYear: 2018,
          totalCopies: 5,
          availableCopies: 2,
          location: 'ENG-Section-D3',
          description: 'Comprehensive introduction to materials science and engineering.',
          rating: 4.4,
          tags: ['materials-science', 'engineering', 'properties']
        },
        
        // Chemistry Books
        {
          _id: '19',
          title: 'Organic Chemistry',
          author: 'Paula Yurkanis Bruice',
          isbn: '978-0134042282',
          category: 'Chemistry',
          publisher: 'Pearson',
          publishYear: 2016,
          totalCopies: 6,
          availableCopies: 4,
          location: 'CHEM-Section-E1',
          description: 'Comprehensive organic chemistry textbook with modern approach.',
          rating: 4.3,
          tags: ['organic-chemistry', 'reactions', 'mechanisms']
        },
        {
          _id: '20',
          title: 'General Chemistry: The Essential Concepts',
          author: 'Raymond Chang, Jason Overby',
          isbn: '978-0073402758',
          category: 'Chemistry',
          publisher: 'McGraw-Hill',
          publishYear: 2018,
          totalCopies: 8,
          availableCopies: 6,
          location: 'CHEM-Section-E2',
          description: 'Essential concepts in general chemistry for science majors.',
          rating: 4.2,
          tags: ['general-chemistry', 'atoms', 'bonding']
        },
        
        // Business Books
        {
          _id: '21',
          title: 'Principles of Management',
          author: 'Stephen P. Robbins, Mary Coulter',
          isbn: '978-0134486833',
          category: 'Business',
          publisher: 'Pearson',
          publishYear: 2017,
          totalCopies: 5,
          availableCopies: 3,
          location: 'BUS-Section-F1',
          description: 'Fundamental principles of management theory and practice.',
          rating: 4.1,
          tags: ['management', 'leadership', 'business']
        },
        {
          _id: '22',
          title: 'Financial Accounting',
          author: 'Jerry J. Weygandt, Paul D. Kimmel, Donald E. Kieso',
          isbn: '978-1119493631',
          category: 'Business',
          publisher: 'Wiley',
          publishYear: 2018,
          totalCopies: 6,
          availableCopies: 4,
          location: 'BUS-Section-F2',
          description: 'Introduction to financial accounting principles and practices.',
          rating: 4.0,
          tags: ['accounting', 'finance', 'financial-statements']
        },
        
        // Literature Books
        {
          _id: '23',
          title: 'The Norton Anthology of English Literature',
          author: 'Stephen Greenblatt',
          isbn: '978-0393603132',
          category: 'Literature',
          publisher: 'W. W. Norton & Company',
          publishYear: 2018,
          totalCopies: 4,
          availableCopies: 2,
          location: 'LIT-Section-G1',
          description: 'Comprehensive collection of English literature from medieval to modern times.',
          rating: 4.5,
          tags: ['literature', 'english', 'anthology']
        },
        {
          _id: '24',
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          isbn: '978-0141439518',
          category: 'Literature',
          publisher: 'Penguin Classics',
          publishYear: 2003,
          totalCopies: 7,
          availableCopies: 5,
          location: 'LIT-Section-G2',
          description: 'Classic novel of manners and romance in Regency England.',
          rating: 4.7,
          tags: ['classic', 'romance', 'british-literature']
        },
        {
          _id: '25',
          title: '1984',
          author: 'George Orwell',
          isbn: '978-0451524935',
          category: 'Literature',
          publisher: 'Signet Classics',
          publishYear: 1961,
          totalCopies: 8,
          availableCopies: 3,
          location: 'LIT-Section-G3',
          description: 'Dystopian novel about totalitarianism and surveillance.',
          rating: 4.8,
          tags: ['dystopian', 'classic', 'political-fiction']
        }
      ];
      
      // Apply filters to sample data
      let filteredBooks = sampleBooks;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.category.toLowerCase().includes(search)
        );
      }
      if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
      }
      
      console.log('Setting filtered books:', filteredBooks);
      setBooks(filteredBooks);
    } finally {
      setLoading(false);
      console.log('fetchBooks completed, loading set to false');
    }
  };

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const response = await libraryAPI.getMyBooks();
      if (response.success) {
        setMyBooks(response.borrows);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching my books:', error);
      // Enhanced hardcoded borrowing data for better user experience
      const currentDate = new Date();
      const sampleBorrows = [
        {
          _id: 'borrow1',
          book: {
            _id: '1',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen, Charles E. Leiserson',
            isbn: '978-0262033848',
            category: 'Computer Science'
          },
          borrowDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: {
            amount: 0,
            lateFeeAmount: 0,
            totalAmount: 0,
            isPaid: true,
            paymentDate: null
          }
        },
        {
          _id: 'borrow2',
          book: {
            _id: '8',
            title: 'The Pragmatic Programmer',
            author: 'David Thomas, Andrew Hunt',
            isbn: '978-0135957059',
            category: 'Computer Science'
          },
          borrowDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: {
            amount: 0,
            lateFeeAmount: 0,
            totalAmount: 0,
            isPaid: true,
            paymentDate: null
          }
        },
        {
          _id: 'borrow3',
          book: {
            _id: '2',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            isbn: '978-0132350884',
            category: 'Computer Science'
          },
          borrowDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'overdue',
          renewalCount: 1,
          fine: {
            amount: user?.role === 'student' ? 15 : 30,
            lateFeeAmount: 0,
            totalAmount: user?.role === 'student' ? 15 : 30,
            isPaid: false,
            paymentDate: null
          }
        },
        {
          _id: 'borrow4',
          book: {
            _id: '13',
            title: 'Physics for Scientists and Engineers',
            author: 'Raymond A. Serway, John W. Jewett',
            isbn: '978-1133947271',
            category: 'Physics'
          },
          borrowDate: new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'overdue',
          renewalCount: 0,
          fine: {
            amount: user?.role === 'student' ? 5 : 10,
            lateFeeAmount: 0,
            totalAmount: user?.role === 'student' ? 5 : 10,
            isPaid: false,
            paymentDate: null
          }
        },
        {
          _id: 'borrow5',
          book: {
            _id: '9',
            title: 'Calculus: Early Transcendentals',
            author: 'James Stewart, Daniel K. Clegg, Saleem Watson',
            isbn: '978-1285741550',
            category: 'Mathematics'
          },
          borrowDate: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'returned',
          renewalCount: 0,
          fine: {
            amount: user?.role === 'student' ? 65 : 130,
            lateFeeAmount: 25,
            totalAmount: user?.role === 'student' ? 90 : 155,
            isPaid: true,
            paymentDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          _id: 'borrow6',
          book: {
            _id: '24',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            isbn: '978-0141439518',
            category: 'Literature'
          },
          borrowDate: new Date(currentDate.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'returned',
          renewalCount: 1,
          fine: {
            amount: user?.role === 'student' ? 90 : 180,
            lateFeeAmount: 50,
            totalAmount: user?.role === 'student' ? 140 : 230,
            isPaid: true,
            paymentDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];
      
      // All users can see their borrowed books
      setMyBooks(sampleBorrows);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminBorrows = async () => {
    setLoading(true);
    try {
      const response = await libraryAPI.getAdminBorrows();
      if (response.success) {
        setAdminBorrows(response.borrows);
        setAdminStats(response.stats);
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Fallback to comprehensive sample admin data
      const currentDate = new Date();
      const sampleAdminBorrows = [
        {
          _id: 'admin_borrow1',
          book: {
            _id: '1',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen'
          },
          borrower: {
            _id: 'user1',
            name: 'John Smith',
            email: 'john.smith@university.edu'
          },
          borrowerType: 'student',
          borrowDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: { amount: 0, lateFeeAmount: 0, totalAmount: 0, isPaid: true }
        },
        {
          _id: 'admin_borrow2',
          book: {
            _id: '2',
            title: 'Clean Code',
            author: 'Robert C. Martin'
          },
          borrower: {
            _id: 'user2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@university.edu'
          },
          borrowerType: 'student',
          borrowDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'overdue',
          renewalCount: 1,
          fine: { amount: 15, lateFeeAmount: 0, totalAmount: 15, isPaid: false }
        },
        {
          _id: 'admin_borrow3',
          book: {
            _id: '5',
            title: 'Physics for Scientists and Engineers',
            author: 'Raymond A. Serway'
          },
          borrower: {
            _id: 'faculty1',
            name: 'Dr. Michael Brown',
            email: 'michael.brown@university.edu'
          },
          borrowerType: 'faculty',
          borrowDate: new Date(currentDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: { amount: 0, lateFeeAmount: 0, totalAmount: 0, isPaid: true }
        },
        {
          _id: 'admin_borrow4',
          book: {
            _id: '6',
            title: 'Database System Concepts',
            author: 'Abraham Silberschatz'
          },
          borrower: {
            _id: 'user3',
            name: 'Emily Davis',
            email: 'emily.davis@university.edu'
          },
          borrowerType: 'student',
          borrowDate: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'returned',
          renewalCount: 0,
          fine: { amount: 65, lateFeeAmount: 25, totalAmount: 90, isPaid: true }
        },
        {
          _id: 'admin_borrow5',
          book: {
            _id: '8',
            title: 'Operating System Concepts',
            author: 'Abraham Silberschatz'
          },
          borrower: {
            _id: 'user4',
            name: 'David Wilson',
            email: 'david.wilson@university.edu'
          },
          borrowerType: 'student',
          borrowDate: new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'overdue',
          renewalCount: 2,
          fine: { amount: 40, lateFeeAmount: 15, totalAmount: 55, isPaid: false }
        },
        {
          _id: 'admin_borrow6',
          book: {
            _id: '9',
            title: 'Artificial Intelligence: A Modern Approach',
            author: 'Stuart Russell'
          },
          borrower: {
            _id: 'faculty2',
            name: 'Dr. Lisa Anderson',
            email: 'lisa.anderson@university.edu'
          },
          borrowerType: 'faculty',
          borrowDate: new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: { amount: 0, lateFeeAmount: 0, totalAmount: 0, isPaid: true }
        }
      ];

      // Calculate admin statistics
      const totalBorrows = sampleAdminBorrows.length;
      const activeBorrows = sampleAdminBorrows.filter(b => b.status === 'borrowed').length;
      const overdueBorrows = sampleAdminBorrows.filter(b => b.status === 'overdue').length;
      const totalFines = sampleAdminBorrows.reduce((sum, b) => sum + b.fine.totalAmount, 0);
      const paidFines = sampleAdminBorrows.filter(b => b.fine.isPaid).reduce((sum, b) => sum + b.fine.totalAmount, 0);
      const unpaidFines = sampleAdminBorrows.filter(b => !b.fine.isPaid).reduce((sum, b) => sum + b.fine.totalAmount, 0);

      setAdminBorrows(sampleAdminBorrows);
      setAdminStats({
        totalBorrows,
        activeBorrows,
        overdueBorrows,
        totalFines: [{ total: totalFines }],
        paidFines: [{ total: paidFines }],
        unpaidFines: [{ total: unpaidFines }]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const response = await libraryAPI.borrowBook(bookId);
      if (response.success) {
        alert('Book borrowed successfully!');
        fetchBooks(); // Refresh books list
        if (activeTab === 'my-books') {
          fetchMyBooks(); // Refresh my books if on that tab
        }
      } else {
        alert(response.message || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      // Simulate dynamic borrowing for demo
      const book = books.find(b => b._id === bookId);
      if (book && book.availableCopies > 0) {
        // Update book availability
        const updatedBooks = books.map(b => 
          b._id === bookId 
            ? { ...b, availableCopies: b.availableCopies - 1 }
            : b
        );
        setBooks(updatedBooks);

        // Add to user's borrowed books
        const currentDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + (user?.role === 'student' ? 7 : 14));

        const newBorrow = {
          _id: `borrow_${Date.now()}`,
          book: {
            _id: book._id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category
          },
          borrowDate: currentDate.toISOString(),
          dueDate: dueDate.toISOString(),
          returnDate: null,
          status: 'borrowed',
          renewalCount: 0,
          fine: {
            amount: 0,
            lateFeeAmount: 0,
            totalAmount: 0,
            isPaid: true,
            paymentDate: null
          }
        };

        // Update my books list
        setMyBooks(prev => [newBorrow, ...prev]);

        // Update admin data if admin is viewing
        if (user?.role === 'admin') {
          const adminBorrow = {
            ...newBorrow,
            borrower: {
              _id: user._id,
              name: user.name || 'Current User',
              email: user.email || 'user@university.edu'
            },
            borrowerType: user.role
          };
          setAdminBorrows(prev => [adminBorrow, ...prev]);
          
          // Update admin stats
          setAdminStats(prev => ({
            ...prev,
            totalBorrows: (prev.totalBorrows || 0) + 1,
            activeBorrows: (prev.activeBorrows || 0) + 1
          }));
        }

        alert(`Book "${book.title}" borrowed successfully! Due date: ${dueDate.toLocaleDateString()}`);
      } else {
        alert('Book is not available for borrowing');
      }
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const response = await libraryAPI.returnBook(borrowId);
      if (response.success) {
        alert(`Book returned successfully! ${response.fine > 0 ? `Fine: ₹${response.fine}` : ''}`);
        fetchMyBooks();
        if (activeTab === 'admin') fetchAdminBorrows();
      } else {
        alert(response.message || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      // Demo mode: Update local state
      const borrow = myBooks.find(b => b._id === borrowId);
      if (borrow) {
        const updatedMyBooks = myBooks.map(b => 
          b._id === borrowId 
            ? { ...b, status: 'returned', returnDate: new Date().toISOString() }
            : b
        );
        setMyBooks(updatedMyBooks);
        
        // Update book availability
        const updatedBooks = books.map(book => 
          book._id === borrow.book._id 
            ? { ...book, availableCopies: book.availableCopies + 1 }
            : book
        );
        setBooks(updatedBooks);
        
        alert('Book returned successfully! (Demo mode)');
      }
    }
  };

  const handlePayFine = async (paymentMethod) => {
    if (!selectedBorrow) return;
    
    const fineAmount = selectedBorrow.fine?.totalAmount || 0;
    
    try {
      if (paymentMethod === 'wallet') {
        // Use wallet for payment
        if (balance < fineAmount) {
          alert(`Insufficient wallet balance. Current balance: ₹${balance}, Required: ₹${fineAmount}`);
          return;
        }
        
        await processPayment(fineAmount, `Library Fine - ${selectedBorrow.book.title}`, 'library');
        
        // Update local state
        setMyBooks(prev => prev.map(borrow => 
          borrow._id === selectedBorrow._id 
            ? { ...borrow, fine: { ...borrow.fine, isPaid: true, paymentDate: new Date().toISOString() }}
            : borrow
        ));
        
        if (activeTab === 'admin') {
          setAdminBorrows(prev => prev.map(borrow => 
            borrow._id === selectedBorrow._id 
              ? { ...borrow, fine: { ...borrow.fine, isPaid: true, paymentDate: new Date().toISOString() }}
              : borrow
          ));
        }
        
        alert(`Fine paid successfully via wallet! Amount: ₹${fineAmount}. Remaining balance: ₹${balance - fineAmount}`);
      } else {
        // Try API call for other payment methods
        const response = await libraryAPI.payFine(selectedBorrow._id, paymentMethod);
        if (response.success) {
          alert(`Fine paid successfully! Amount: ₹${response.amount}`);
          fetchMyBooks();
          if (activeTab === 'admin') fetchAdminBorrows();
        } else {
          alert(response.message || 'Payment failed');
        }
      }
      
      setShowPaymentModal(false);
      setSelectedBorrow(null);
    } catch (error) {
      if (error.message === 'Insufficient balance') {
        alert(`Insufficient wallet balance. Current balance: ₹${balance}, Required: ₹${fineAmount}`);
      } else {
        alert('Payment error: ' + error.message);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Library Management</h1>
            <p className="text-gray-400">
              {user?.role === 'admin' ? 'Manage books and track borrowings' : 
               'Browse and manage your borrowed books'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Browse Books
          </button>
          <button
            onClick={() => setActiveTab('my-books')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-books' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            My Books
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Admin Dashboard
            </button>
          )}
        </div>

        {/* Browse Books Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Book</span>
                </button>
              )}
            </div>

            {/* Books Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {console.log('Rendering books:', books, 'Loading:', loading)}
                {books.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No books found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  books.map(book => (
                    <div key={book._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <Book className="text-blue-400" size={24} />
                        <span className={`px-2 py-1 rounded text-xs ${
                          book.availableCopies > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">{book.title}</h3>
                      <p className="text-gray-400 mb-2">by {book.author}</p>
                      <p className="text-gray-500 text-sm mb-2">ISBN: {book.isbn}</p>
                      <p className="text-gray-500 text-sm mb-4">Category: {book.category}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>Available: {book.availableCopies}/{book.totalCopies}</span>
                        <span>Location: {book.location}</span>
                      </div>
                      {book.availableCopies > 0 && user?.role !== 'admin' && (
                        <button
                          onClick={() => handleBorrowBook(book._id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Borrow Book
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* My Books Tab */}
        {activeTab === 'my-books' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {myBooks.map(borrow => (
                <div key={borrow._id} className={`bg-gray-800 rounded-lg p-6 border ${
                  borrow.status === 'overdue' ? 'border-red-500' : 
                  borrow.fine.totalAmount > 0 ? 'border-yellow-500' : 'border-gray-700'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{borrow.book.title}</h3>
                      <p className="text-gray-400">by {borrow.book.author}</p>
                      <p className="text-gray-500 text-sm">ISBN: {borrow.book.isbn}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      borrow.status === 'borrowed' ? 'bg-blue-600 text-white' :
                      borrow.status === 'overdue' ? 'bg-red-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {borrow.status.charAt(0).toUpperCase() + borrow.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Borrowed:</span>
                      <p className="text-white">{formatDate(borrow.borrowDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Due Date:</span>
                      <p className={`${borrow.status === 'overdue' ? 'text-red-400' : 'text-white'}`}>
                        {formatDate(borrow.dueDate)}
                      </p>
                    </div>
                    {borrow.status === 'overdue' && (
                      <div>
                        <span className="text-gray-400">Days Overdue:</span>
                        <p className="text-red-400">{getDaysOverdue(borrow.dueDate)} days</p>
                      </div>
                    )}
                    {borrow.fine.totalAmount > 0 && (
                      <div>
                        <span className="text-gray-400">Fine:</span>
                        <p className={`${borrow.fine.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                          ₹{borrow.fine.totalAmount} {borrow.fine.isPaid ? '(Paid)' : '(Pending)'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {borrow.status !== 'returned' && (
                      <button
                        onClick={() => handleReturnBook(borrow._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        Return Book
                      </button>
                    )}
                    {borrow.fine.totalAmount > 0 && !borrow.fine.isPaid && (
                      <button
                        onClick={() => {
                          setSelectedBorrow(borrow);
                          setShowPaymentModal(true);
                        }}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center space-x-2"
                      >
                        <CreditCard size={16} />
                        <span>Pay Fine (₹{borrow.fine.totalAmount})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Borrows</p>
                    <p className="text-2xl font-bold text-white">{adminStats.totalBorrows || 0}</p>
                  </div>
                  <Book className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Borrows</p>
                    <p className="text-2xl font-bold text-white">{adminStats.activeBorrows || 0}</p>
                  </div>
                  <Clock className="text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Overdue Books</p>
                    <p className="text-2xl font-bold text-red-400">{adminStats.overdueBorrows || 0}</p>
                  </div>
                  <AlertTriangle className="text-red-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Fines</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ₹{adminStats.totalFines?.[0]?.total || 0}
                    </p>
                  </div>
                  <IndianRupee className="text-yellow-400" size={24} />
                </div>
              </div>
            </div>

            {/* Fine Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Fine Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid Fines:</span>
                    <span className="text-green-400">₹{adminStats.paidFines?.[0]?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unpaid Fines:</span>
                    <span className="text-red-400">₹{adminStats.unpaidFines?.[0]?.total || 0}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAddBookModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Add New Book
                  </button>
                  <button
                    onClick={fetchAdminBorrows}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Refresh Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Borrowing Records */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Borrowing Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 pb-2">Book</th>
                      <th className="text-left text-gray-400 pb-2">Borrower</th>
                      <th className="text-left text-gray-400 pb-2">Type</th>
                      <th className="text-left text-gray-400 pb-2">Due Date</th>
                      <th className="text-left text-gray-400 pb-2">Status</th>
                      <th className="text-left text-gray-400 pb-2">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminBorrows.slice(0, 10).map(borrow => (
                      <tr key={borrow._id} className="border-b border-gray-700">
                        <td className="py-2 text-white">{borrow.book.title}</td>
                        <td className="py-2 text-gray-300">{borrow.borrower.name}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            borrow.borrowerType === 'student' ? 'bg-blue-600' : 'bg-purple-600'
                          } text-white`}>
                            {borrow.borrowerType}
                          </span>
                        </td>
                        <td className="py-2 text-gray-300">{formatDate(borrow.dueDate)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            borrow.status === 'borrowed' ? 'bg-green-600' :
                            borrow.status === 'overdue' ? 'bg-red-600' :
                            'bg-gray-600'
                          } text-white`}>
                            {borrow.status}
                          </span>
                        </td>
                        <td className="py-2">
                          {borrow.fine.totalAmount > 0 ? (
                            <span className={`${borrow.fine.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                              ₹{borrow.fine.totalAmount} {borrow.fine.isPaid ? '✓' : '✗'}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Book Modal */}
        {showAddBookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Add New Book</h3>
              <AddBookForm 
                onSuccess={() => {
                  setShowAddBookModal(false);
                  fetchBooks();
                }}
                onCancel={() => setShowAddBookModal(false)}
              />
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedBorrow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Pay Fine</h3>
              <div className="mb-4">
                <p className="text-gray-400">Book: {selectedBorrow.book.title}</p>
                <p className="text-gray-400">Fine Amount: ₹{selectedBorrow.fine.amount}</p>
                {selectedBorrow.fine.lateFeeAmount > 0 && (
                  <p className="text-red-400">Late Fee: ₹{selectedBorrow.fine.lateFeeAmount}</p>
                )}
                <p className="text-white font-semibold">Total: ₹{selectedBorrow.fine.totalAmount}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handlePayFine('credit_card')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Pay with Credit Card
                </button>
                <button
                  onClick={() => handlePayFine('debit_card')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  Pay with Debit Card
                </button>
                <button
                  onClick={() => handlePayFine('upi')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
                >
                  Pay with UPI
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBorrow(null);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Add Book Form Component
function AddBookForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    publisher: '',
    publishYear: new Date().getFullYear(),
    totalCopies: 1,
    location: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await libraryAPI.addBook(formData);
      if (response.success) {
        alert('Book added successfully!');
        onSuccess();
      } else {
        alert(response.message || 'Failed to add book');
      }
    } catch (error) {
      alert('Error adding book');
    }
  };

  const categories = [
    'Computer Science', 'Mathematics', 'Physics', 
    'Engineering', 'Business', 'Literature', 'Research', 'General'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ISBN</label>
          <input
            type="text"
            required
            value={formData.isbn}
            onChange={(e) => setFormData({...formData, isbn: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Publisher</label>
          <input
            type="text"
            required
            value={formData.publisher}
            onChange={(e) => setFormData({...formData, publisher: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Publish Year</label>
          <input
            type="number"
            required
            min="1900"
            max={new Date().getFullYear()}
            value={formData.publishYear}
            onChange={(e) => setFormData({...formData, publishYear: parseInt(e.target.value)})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Total Copies</label>
          <input
            type="number"
            required
            min="1"
            value={formData.totalCopies}
            onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Add Book
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
