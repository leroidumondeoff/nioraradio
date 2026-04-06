/**
 * JSONBin.io Integration
 * Manages user accounts and data persistence
 * 
 * IMPORTANT: Replace these with your actual JSONBin.io credentials
 * Get your API key from: https://jsonbin.io/
 */

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const JSONBIN_API_KEY = 'YOUR_JSONBIN_API_KEY'; // Replace with your actual key
const JSONBIN_BIN_ID = 'YOUR_BIN_ID'; // Replace with your actual bin ID

export interface User {
  id: string;
  email: string;
  password: string; // Should be hashed in production
  nom: string;
  prenom: string;
  avatar?: string;
  role: 'user' | 'animator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserDatabase {
  users: User[];
  lastUpdated: string;
}

/**
 * Fetch all users from JSONBin
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b/${JSONBIN_BIN_ID}`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error fetching users:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.record?.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Save all users to JSONBin
 */
export async function saveAllUsers(users: User[]): Promise<boolean> {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users,
        lastUpdated: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('Error saving users:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

/**
 * Create a new user
 */
export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
  try {
    const users = await getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      console.error('Email already exists');
      return null;
    }

    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    const saved = await saveAllUsers(users);

    return saved ? newUser : null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getAllUsers();
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

/**
 * Authenticate user
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      console.error('User not found');
      return null;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveAllUsers(users);
    return saved ? users[userIndex] : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const users = await getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);

    if (filteredUsers.length === users.length) {
      console.error('User not found');
      return false;
    }

    return await saveAllUsers(filteredUsers);
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Local storage fallback for development
 */
export function getLocalUsers(): User[] {
  try {
    const stored = localStorage.getItem('nioraUsers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: User[]): void {
  localStorage.setItem('nioraUsers', JSON.stringify(users));
}
