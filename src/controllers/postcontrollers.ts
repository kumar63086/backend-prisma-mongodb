

import { Request, Response, NextFunction } from 'express';
import prisma from '../models/prisma';

// Create a new post
export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { slug, title, body, authorId } = req.body;

        // Validation logic can be added here
        const result = await prisma.post.create({
            data: {
                slug,
                title,
                body,
                author: { connect: { id: authorId } },
            },
        });

        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'An error occurred while creating the post.' });
    }
};

// Update an existing post
export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { title, body } = req.body;

    try {
        const result = await prisma.post.update({
            where: { id },
            data: { title, body },
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: `Post with ID ${id} does not exist.` });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await prisma.post.delete({
            where: { id },
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: `Post with ID ${id} does not exist.` });
    }
};

// Get all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await prisma.post.findMany();

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'No posts were found.' });
    }
};
