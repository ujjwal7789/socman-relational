// models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Apartment = require('./Apartment');
const Notice = require('./Notice');
const HelpDesk = require('./HelpDesk');
const Payment = require('./Payment');
const Visitor = require('./Visitor');
const Amenity = require('./Amenity');
const Booking = require('./Booking');
const ForumPost = require('./ForumPost');
const ForumComment = require('./ForumComment');
const Poll = require('./Poll');
const PollOption = require('./PollOption');
const PollVote = require('./PollVote');
const Vehicle = require('./Vehicle');
const Alert = require('./Alert');

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Apartment = Apartment;
db.Notice = Notice;
db.HelpDesk = HelpDesk;
db.Payment = Payment;
db.Visitor = Visitor;
db.Amenity = Amenity;
db.Booking = Booking;
db.ForumPost = ForumPost;
db.ForumComment = ForumComment;
db.Poll = Poll;
db.PollVote = PollVote;
db.PollOption = PollOption;
db.Vehicle = Vehicle;
db.Alert = Alert;

// --- DEFINE ASSOCIATIONS ---

// User -> Apartment (One-to-One)
User.hasOne(Apartment, { foreignKey: 'owner_id', as: 'apartmentDetails' });
Apartment.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User -> Many other models (One-to-Many)
User.hasMany(HelpDesk, { foreignKey: 'raised_by', as: 'raisedTickets' });
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
User.hasMany(Booking, { foreignKey: 'booked_by_user', as: 'bookings' });
User.hasMany(ForumPost, { foreignKey: 'author_id', as: 'posts' });
User.hasMany(ForumComment, { foreignKey: 'author_id', as: 'comments' });
User.hasMany(PollVote, { foreignKey: 'user_id', as: 'votes' });
User.hasMany(Vehicle, { foreignKey: 'owner_id', as: 'vehicles' });
User.hasMany(Alert, { foreignKey: 'raised_by', as: 'alerts' });
User.hasMany(Notice, { foreignKey: 'created_by', as: 'createdNotices' });

// Relationships for HelpDesk
HelpDesk.belongsTo(User, { foreignKey: 'raised_by', as: 'requester' });
HelpDesk.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTo' }); // A ticket can be assigned to an admin/staff

// Relationships for Visitors (User has two roles here: Resident and Security)
Visitor.belongsTo(User, { foreignKey: 'approved_by_resident', as: 'resident' });
Visitor.belongsTo(User, { foreignKey: 'checked_in_by_security', as: 'securityGuard' });

// Amenity and Bookings
Amenity.hasMany(Booking, { foreignKey: 'amenity_id', as: 'bookings' });
Booking.belongsTo(Amenity, { foreignKey: 'amenity_id', as: 'amenity' });
Booking.belongsTo(User, { foreignKey: 'booked_by_user', as: 'resident' });

// Forum Posts and Comments
ForumPost.hasMany(ForumComment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });
ForumPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
ForumComment.belongsTo(ForumPost, { foreignKey: 'post_id', as: 'post' });
ForumComment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Polls, Options, and Votes
Poll.hasMany(PollOption, { foreignKey: 'poll_id', as: 'options', onDelete: 'CASCADE' });
Poll.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
PollOption.belongsTo(Poll, { foreignKey: 'poll_id' });
PollOption.hasMany(PollVote, { foreignKey: 'option_id', as: 'votes', onDelete: 'CASCADE' });
PollVote.belongsTo(PollOption, { foreignKey: 'option_id' });
PollVote.belongsTo(User, { foreignKey: 'user_id' });
PollVote.belongsTo(Poll, { foreignKey: 'poll_id' });

// Other simple relationships
Vehicle.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Alert.belongsTo(User, { foreignKey: 'raised_by', as: 'resident' });
Alert.belongsTo(User, { foreignKey: 'acknowledged_by', as: 'staff' });
Notice.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

module.exports = {
  ...db,
  User,
  Apartment,
  Notice,
  HelpDesk,
  Payment,
  Visitor,
  Amenity,
  Booking,
  ForumPost,
  ForumComment,
  Poll,
  PollOption,
  PollVote,
  Vehicle,
  Alert,
};