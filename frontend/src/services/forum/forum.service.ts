import { ForumArticle, ForumPost, ForumDiscussionPost, ForumComment, ForumStats, ForumCategory, RelatedExam, vnsocialTopic, ForumPackage, ForumTopic } from "@/features/dashboard/types/forum";
import { httpClient } from "@/lib/http";

// Helper function to generate a color for a category
const getCategoryColor = (categoryName: string): string => {
    const colors: { [key: string]: string } = {
        'văn hóa số': '#3B82F6',
        'áp lực học tập': '#EF4444',
        'ứng xử văn minh': '#8B5CF6',
        'lối sống xanh': '#10B981',
        'sự tử tế': '#EC4899',
    };
    
    const key = categoryName.toLowerCase();
    return colors[key] || '#F59E0B';
};

// Helper function to calculate time ago
const getTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
};

// Transform ForumPackage to ForumArticle
const transformPackageToArticle = (pkg: ForumPackage): ForumArticle => {
    // Calculate aggregated stats from all forum topics
    const forumTopics = pkg.forumTopics || [];
    const totalLikes = forumTopics.reduce((sum, topic) => sum + (topic.stats?.totalLikes || 0), 0);
    const totalComments = forumTopics.reduce((sum, topic) => sum + (topic.stats?.totalComments || 0), 0);
    const totalViews = forumTopics.reduce((sum, topic) => sum + (topic.stats?.totalViews || 0), 0);
    
    // Determine if trending based on engagement
    const isTrending = totalLikes > 10 || totalComments > 20 || totalViews > 100;
    
    return {
        id: pkg._id, // Keep as string
        title: pkg.packageTitle,
        content: [pkg.packageSummary],
        excerpt: pkg.packageSummary.substring(0, 200) + '...',
        category: pkg.vnsocialTopic?.name || 'Chưa phân loại',
        categoryColor: getCategoryColor(pkg.vnsocialTopic?.name || ''),
        source: 'VnSocial',
        sourceUrl: pkg.sourceArticle?.url || '',
        timeAgo: getTimeAgo(pkg.createdAt),
        views: totalViews,
        likes: totalLikes,
        discussionPostsCount: forumTopics.length,
        commentsCount: totalComments,
        isTrending: isTrending,
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
        tags: pkg.tags,
        relatedExamId: undefined,
        forumTopics: forumTopics,
    };
};

export class ForumService {
    // Get all articles from VnSocial (now from ForumPackages)
    static async getArticles(): Promise<ForumArticle[]> {
        try {
            const response = await httpClient.get<{ success: boolean; data: { packages: ForumPackage[]; total: number } }>(
                '/forum/packages',
                { requiresAuth: true }
            );
            
            const packages = response.data?.packages || [];
            return packages.map(transformPackageToArticle);
        } catch (error) {
            console.error('Error fetching forum articles:', error);
            return [];
        }
    }

    // Legacy method for backward compatibility
    static async getPosts(): Promise<ForumPost[]> {
        return this.getArticles();
    }

    // Get a single article by ID
    static async getArticleById(id: string): Promise<ForumArticle | null> {
        try {
            const pkg = await this.getPackageById(id);
            return pkg ? transformPackageToArticle(pkg) : null;
        } catch (error) {
            console.error('Error fetching forum package:', error);
            return null;
        }
    }

    // Legacy method for backward compatibility
    static async getPostById(id: string): Promise<ForumPost | null> {
        return this.getArticleById(id);
    }

    // Get forum topics by packageId (article ID)
    static async getTopicsByPackageId(packageId: string): Promise<ForumTopic[]> {
        try {
            const response = await httpClient.get<{ success: boolean; data: { topics: ForumTopic[] } }>(
                `/forum/topics?packageId=${packageId}`,
                { requiresAuth: true }
            );
            return response.data?.topics || [];
        } catch (error) {
            console.error('Error fetching forum topics:', error);
            return [];
        }
    }

    // Get discussion posts for an article
    static async getDiscussionPostsByArticleId(articleId: number): Promise<ForumDiscussionPost[]> {
        try {
            return await httpClient.get<ForumDiscussionPost[]>(
                `/forum_discussion_posts?articleId=${articleId}`,
                { requiresAuth: true }
            );
        } catch (error) {
            console.error('Error fetching discussion posts:', error);
            return [];
        }
    }

    // Get comments for a discussion post
    static async getCommentsByDiscussionPostId(discussionPostId: string): Promise<ForumComment[]> {
        try {
            return await httpClient.get<ForumComment[]>(
                `/forum_comments?discussionPostId=${discussionPostId}`,
                { requiresAuth: true }
            );
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // Legacy method - now gets comments for the first discussion post of an article
    static async getCommentsByPostId(articleId: number): Promise<ForumComment[]> {
        try {
            // Get discussion posts for the article
            const discussionPosts = await this.getDiscussionPostsByArticleId(articleId);
            if (discussionPosts.length === 0) return [];
            
            // Get comments for the first discussion post
            return this.getCommentsByDiscussionPostId(discussionPosts[0].id);
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    static async getCategories(): Promise<ForumCategory[]> {
        try {
            return await httpClient.get<ForumCategory[]>('/forum_categories', { requiresAuth: true });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async getStats(): Promise<ForumStats> {
        try {
            return await httpClient.get<ForumStats>('/forum_stats', { requiresAuth: true });
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalArticles: 0,
                totalDiscussionPosts: 0,
                totalComments: 0,
                activeUsers: 0
            };
        }
    }

    // Get related exam for an article
    static async getRelatedExam(articleId: number): Promise<RelatedExam | null> {
        try {
            const exams = await httpClient.get<RelatedExam[]>(
                `/related_exams?articleId=${articleId}`,
                { requiresAuth: true }
            );
            return exams[0] || null;
        } catch (error) {
            console.error('Error fetching related exam:', error);
            return null;
        }
    }

    // Get VnSocial topics
    static async getVnSocialTopics(type?: string): Promise<vnsocialTopic[]> {
        try {
            const endpoint = type ? `/vnsocial/topics?type=${type}` : '/vnsocial/topics';
            const result = await httpClient.get<{ success: boolean; data: { topics: vnsocialTopic[]; total: number } }>(
                endpoint,
                { requiresAuth: true }
            );
            return result.data?.topics || [];
        } catch (error) {
            console.error('Error fetching VnSocial topics:', error);
            return [];
        }
    }

    // Generate forum articles (Admin only)
    static async generateArticles(params: {
        topicId: string;
        count?: number;
        source?: string;
        startTime?: number;
        endTime?: number;
    }): Promise<{ success: boolean; message: string; data: any }> {
        try {
            // If startTime and endTime are not provided, use last 7 days
            const endTime = params.endTime || Date.now();
            const startTime = params.startTime || (endTime - 7 * 24 * 60 * 60 * 1000);

            const response = await httpClient.post<{ success: boolean; message: string; data: any }>(
                '/forum/topics/generate',
                {
                    topicId: params.topicId,
                    count: params.count || 3,
                    source: params.source || 'baochi',
                    startTime: startTime,
                    endTime: endTime,
                },
                { 
                    requiresAuth: true,
                    timeout: 180000 // 3 minutes timeout for AI generation (VnSocial + SmartBot can be slow)
                }
            );
            return response;
        } catch (error: any) {
            console.error('Error generating articles:', error);
            throw new Error(error?.message || 'Failed to generate articles');
        }
    }

    // Get single package by ID
    static async getPackageById(id: string): Promise<ForumPackage | null> {
        try {
            const response = await httpClient.get<{ success: boolean; data: ForumPackage }>(
                `/forum/packages/${id}`,
                { requiresAuth: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching package:', error);
            return null;
        }
    }

    // Delete package (Admin only)
    static async deletePackage(id: string): Promise<boolean> {
        try {
            await httpClient.delete(`/forum/packages/${id}`, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error deleting package:', error);
            return false;
        }
    }

    // Get topic detail with comments
    static async getTopicDetail(id: string): Promise<{ topic: ForumTopic; comments: any[]; commentsTotal: number } | null> {
        try {
            const response = await httpClient.get<{ success: boolean; data: any }>(
                `/forum/topics/${id}`,
                { requiresAuth: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching topic detail:', error);
            return null;
        }
    }

    // Delete topic (Admin only)
    static async deleteTopic(id: string): Promise<boolean> {
        try {
            await httpClient.delete(`/forum/topics/${id}`, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error deleting topic:', error);
            return false;
        }
    }

    // Create comment for topic
    static async createComment(topicId: string, content: string): Promise<any> {
        try {
            const response = await httpClient.post(
                `/forum/topics/${topicId}/comments`,
                { content },
                { requiresAuth: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    }

    // Update comment
    static async updateComment(commentId: string, content: string): Promise<any> {
        try {
            const response = await httpClient.put(
                `/forum/comments/${commentId}`,
                { content },
                { requiresAuth: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }

    // Delete comment
    static async deleteComment(commentId: string): Promise<boolean> {
        try {
            await httpClient.delete(`/forum/comments/${commentId}`, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            return false;
        }
    }

    // Like topic
    static async likeTopic(topicId: string): Promise<boolean> {
        try {
            await httpClient.post(`/forum/topics/${topicId}/like`, {}, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error liking topic:', error);
            return false;
        }
    }

    // Unlike topic
    static async unlikeTopic(topicId: string): Promise<boolean> {
        try {
            await httpClient.delete(`/forum/topics/${topicId}/like`, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error unliking topic:', error);
            return false;
        }
    }

    // Like comment
    static async likeComment(commentId: string): Promise<boolean> {
        try {
            await httpClient.post(`/forum/comments/${commentId}/like`, {}, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error liking comment:', error);
            return false;
        }
    }

    // Unlike comment
    static async unlikeComment(commentId: string): Promise<boolean> {
        try {
            await httpClient.delete(`/forum/comments/${commentId}/like`, { requiresAuth: true });
            return true;
        } catch (error) {
            console.error('Error unliking comment:', error);
            return false;
        }
    }

    // Get comments for a topic
    static async getTopicComments(topicId: string, page: number = 1, limit: number = 20): Promise<ForumComment[]> {
        try {
            const response = await httpClient.get<{ success: boolean; data: { comments: any[]; total: number } }>(
                `/forum/topics/${topicId}/comments?page=${page}&limit=${limit}`,
                { requiresAuth: true }
            );
            
            // Transform comments - replies are already nested from backend
            const comments = response.data?.comments || [];
            
            // Debug: Log first comment to see structure
            if (comments.length > 0) {
                console.log('📝 First comment structure:', JSON.stringify(comments[0], null, 2));
            }
            
            const transformedComments = comments.map((comment) => {
                // Recursively transform nested replies
                const transformComment = (c: any): any => {
                    // userId should be populated by backend with user details
                    const author = c.userId && typeof c.userId === 'object' ? {
                        _id: c.userId._id,
                        name: c.userId.name,
                        email: c.userId.email,
                        role: c.userId.role,
                        avatar: c.userId.avatar,
                    } : undefined;
                    
                    return {
                        ...c,
                        isAISeed: c.isAiGenerated || false,
                        author,
                        replies: (c.replies || []).map(transformComment),
                    };
                };
                
                return transformComment(comment);
            });
            
            return transformedComments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // Create reply for comment
    static async createReply(commentId: string, content: string): Promise<any> {
        try {
            const response = await httpClient.post(
                `/forum/comments/${commentId}/replies`,
                { content },
                { requiresAuth: true }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    }
}