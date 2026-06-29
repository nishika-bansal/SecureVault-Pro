import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    username: {
      type: String,
      trim: true,
      maxlength: 160
    },
    url: {
      type: String,
      trim: true,
      maxlength: 300
    },
    encryptedPassword: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Personal',
      trim: true,
      maxlength: 80
    },
    favorite: {
      type: Boolean,
      default: false
    },
    strengthScore: {
      type: Number,
      min: 0,
      max: 4,
      default: 0
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

credentialSchema.index({ user: 1, title: 1 });
credentialSchema.index({ user: 1, category: 1 });
credentialSchema.index({ user: 1, favorite: 1 });

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
