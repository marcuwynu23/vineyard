import mongoose, { Schema, Document, Model } from 'mongoose';

// User Model
export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'dev' | 'viewer';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'dev', 'viewer'], default: 'viewer' },
  createdAt: { type: Date, default: Date.now },
});

// Tag Model
export interface ITag extends Document {
  name: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
});

// Idea Model
export interface IIdea extends Document {
  title: string;
  status: 'seed' | 'brewing' | 'prototyped' | 'shipped' | 'archived';
  confidence: 'low' | 'medium' | 'high';
  visibility: 'private' | 'public' | 'unlisted';
  tags: string[];
  authorId: mongoose.Types.ObjectId;
  content: string; // Current content
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>({
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['seed', 'brewing', 'prototyped', 'shipped', 'archived'], 
    default: 'seed' 
  },
  confidence: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'low' 
  },
  visibility: { 
    type: String, 
    enum: ['private', 'public', 'unlisted'], 
    default: 'private' 
  },
  tags: [{ type: String }], // Store tag names directly or ObjectId. Prompt said "Tag model: name, unique". Storing names is easier for display, but refs are cleaner. Let's use refs or strings? "Filtering ideas by... tags". Strings are fine if normalized.
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
}, { timestamps: true });

// IdeaRevision Model
export interface IIdeaRevision extends Document {
  ideaId: mongoose.Types.ObjectId;
  contentMd: string;
  summary?: string;
  changeNote?: string;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const IdeaRevisionSchema = new Schema<IIdeaRevision>({
  ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  contentMd: { type: String, required: true },
  summary: { type: String },
  changeNote: { type: String },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// IdeaLink Model
export interface IIdeaLink extends Document {
  fromIdeaId: mongoose.Types.ObjectId;
  toIdeaId: mongoose.Types.ObjectId;
  type: 'inspired_by' | 'derived_from' | 'merged_into' | 'contradicts';
}

const IdeaLinkSchema = new Schema<IIdeaLink>({
  fromIdeaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  toIdeaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
  type: { 
    type: String, 
    enum: ['inspired_by', 'derived_from', 'merged_into', 'contradicts'], 
    required: true 
  },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export const Idea: Model<IIdea> = mongoose.models.Idea || mongoose.model<IIdea>('Idea', IdeaSchema);
export const IdeaRevision: Model<IIdeaRevision> = mongoose.models.IdeaRevision || mongoose.model<IIdeaRevision>('IdeaRevision', IdeaRevisionSchema);
export const IdeaLink: Model<IIdeaLink> = mongoose.models.IdeaLink || mongoose.model<IIdeaLink>('IdeaLink', IdeaLinkSchema);
