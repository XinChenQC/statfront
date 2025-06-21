import type { User } from '../types';

export interface UserGrowth {
  date: string;
  count: number;
}

export interface CountryDistribution {
  country: string;
  count: number;
}

export const calculateUserGrowth = (users: User[]): UserGrowth[] => {
  const growthMap = new Map<string, number>();
  
  // 首先按日期排序用户
  const sortedUsers = [...users].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // 计算累计总数
  let totalCount = 0;
  sortedUsers.forEach(user => {
    const date = new Date(user.created_at).toLocaleDateString();
    totalCount++;
    growthMap.set(date, totalCount);
  });

  return Array.from(growthMap.entries())
    .map(([date, count]) => ({ date, count }));
};

export const calculateCountryDistribution = (users: User[]): CountryDistribution[] => {
  const countryMap = new Map<string, number>();
  
  users.forEach(user => {
    countryMap.set(user.country, (countryMap.get(user.country) || 0) + 1);
  });

  return Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}; 