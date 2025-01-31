import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './define/user.dto';
import { PostDto } from '../posts/define/post.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: mongoose.Model<UserDto>, @InjectModel('Post') private readonly postModel: mongoose.Model<PostDto>) { }

    private readonly logger = new Logger("loggre");

    async getUser(user?: string) {
		const result = user ? await this.userModel.findById(user) : await this.userModel.find();
		
		if (!result) throw new NotFoundException('No Users Found');
		return result;
    }

    async searchUsers(query: string) {
		const result = await this.userModel.find({ username: { $regex: query, $options: 'i' }, });
		
        if (!result) throw new NotFoundException('No Users Found');
    	return result;
    }

    async getUsersPosts(user: string) {
        const result = await this.postModel.aggregate([
                { $match: { parent: null, author: new mongoose.Types.ObjectId(user) } }, // get post by author
        
                { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
                { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
                { $project: { 'author.authentication': 0 } }, // .populate('author');
        
                { $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
                { $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
                { $project: { repliesCountData: 0 } }, // count replies
            ]);

        if (!result) throw new NotFoundException('No Posts Found');
        return result;
    };
    
    async getUsersReplies(user: string) {
            const result = await this.postModel.aggregate([
                { $match: { parent: { $ne: null }, author: new mongoose.Types.ObjectId(user) } }, // get replies by author
        
                { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author', }, },
                { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
                { $project: { 'author.authentication': 0 } }, // .populate('author');
        
                { $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
                { $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
                { $project: { repliesCountData: 0 } }, // count replies
            ]);
    
            if (!result) throw new NotFoundException('No Posts Found');
            return result;
    };
    
    async getUsersReposts(user: string) {
            const result = await this.postModel.aggregate([
                { $match: { reposts: { $in: [new mongoose.Types.ObjectId(user)] } } }, // get posts reposted by user
        
                { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
                { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
                { $project: { 'author.authentication': 0 } }, // .populate('author');
        
                { $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
                { $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
                { $project: { repliesCountData: 0 } } // count replies
            ]);
    
            if (!result) throw new NotFoundException('No Posts Found');
            return result;
    };
    
    async getUsersLikes(user: string) {
            const result = await this.postModel.aggregate([
                { $match: { likes: { $in: [new mongoose.Types.ObjectId(user)] } } }, // get posts liked by user
        
                { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
                { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
                { $project: { 'author.authentication': 0 } }, // .populate('author');
        
                { $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
                { $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
                { $project: { repliesCountData: 0 } }, // count replies
            ]);
    
            if (!result) throw new NotFoundException('No Posts Found');
            return result;
    };
    
    async getUsersFollowers(user: string) {
            const result = await this.userModel.find({ following: new mongoose.Types.ObjectId(user) });
    
            if (!result) throw new NotFoundException('No Users Found');
            return result;
    };

    async followUser(body: { follower: UserDto, followed: UserDto }) {
        const { follower, followed } = body;

        const userData = await this.userModel.findById(follower._id).select('following');
        const following = userData?.following || [];

        let updatedFollowing;
        const condition = following.some((follow: mongoose.Types.ObjectId) => follow.toString() === followed._id);

        if (!condition) updatedFollowing = [...following, new mongoose.Types.ObjectId(followed._id)];
        else updatedFollowing = following.filter((follow: mongoose.Types.ObjectId) => follow.toString() !== followed._id);

        await this.userModel.findOneAndUpdate({ _id: follower._id }, { following: updatedFollowing });
        follower.following = updatedFollowing.map(follow => follow.toString()) as [string];

		return follower;
    }

    async updateUser(id: string, user: { email?: string, username?: string}) {
		const users = await this.userModel.findOne(user);
        if (users) throw new BadRequestException('User Already Exists');

        await this.userModel.findOneAndUpdate({ _id: id }, user);
		const result = await this.userModel.findById(id);
        
		return result;
    }

    async deleteUser(id: string) {
        const deletedUser = await this.userModel.findOneAndDelete({_id: id});

        if (!deletedUser) throw new NotFoundException('User Not Found');
        return deletedUser;
    }

}
