import z from "zod";

export const friendshipSchema = z.object({ createdDate: z.string().date() });

export type Friendship = z.infer<typeof friendshipSchema>;
// links = ["FRIEND_OF"] as const;
// export type Links = typeof links;
