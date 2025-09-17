
'use server';

// This file is not currently used but is kept for potential future use.
// The project data is now managed manually in src/lib/data.tsx.

export interface GithubRepo {
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    languages: string[];
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    fork: boolean;
    topics: string[];
}
