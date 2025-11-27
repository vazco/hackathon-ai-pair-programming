import type { User } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api-client';
import { AlertTriangle } from 'lucide-react';

type PairingResultProps = {
  user1: User | null;
  user2: User | null;
  isAnimating: boolean;
  reminderUsers: Set<string>;
};

export function PairingResult({
  user1,
  user2,
  isAnimating,
  reminderUsers,
}: PairingResultProps) {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await apiClient.getUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }
    fetchUsers();
  }, []);

  if (!isAnimating && !user1 && !user2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">{t('clickToGenerate')}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 py-8">
      <SlotMachineCard
        user={user1}
        isAnimating={isAnimating}
        allUsers={allUsers}
        reminderUsers={reminderUsers}
      />
      <SlotMachineCard
        user={user2}
        isAnimating={isAnimating}
        allUsers={allUsers}
        reminderUsers={reminderUsers}
      />
    </div>
  );
}

type SlotMachineCardProps = {
  user: User | null;
  isAnimating: boolean;
  allUsers: User[];
  reminderUsers: Set<string>;
};

function SlotMachineCard({
  user,
  isAnimating,
  allUsers,
  reminderUsers,
}: SlotMachineCardProps) {
  const [displayUser, setDisplayUser] = useState<User | null>(user);

  useEffect(() => {
    if (!isAnimating) {
      setDisplayUser(user);
      return;
    }

    if (allUsers.length === 0) return;

    const interval = setInterval(() => {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      if (randomUser) {
        setDisplayUser(randomUser);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isAnimating, user, allUsers]);

  if (!user && !isAnimating) return null;

  return (
    <motion.div
      className="flex flex-col items-center p-8 bg-card rounded-lg border-2 border-border shadow-lg overflow-hidden relative"
      animate={
        isAnimating
          ? {
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                '0 20px 25px -5px rgb(0 0 0 / 0.3)',
                '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              ],
            }
          : { scale: 1 }
      }
      transition={{
        duration: 0.5,
        repeat: isAnimating ? Infinity : 0,
        repeatType: 'reverse',
      }}
    >
      {/* Slot machine rolling overlay */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none z-10"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      <div className="relative">
        {!displayUser ? (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="h-6 bg-primary/20 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
          </div>
        ) : (
          <motion.div
            key={displayUser.name}
            initial={
              isAnimating ? { y: -20, opacity: 0, filter: 'blur(4px)' } : false
            }
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary shadow-xl">
              {displayUser.github ? (
                <img
                  src={`https://github.com/${displayUser.github}.png?size=200`}
                  alt={displayUser.name}
                  className={cn(
                    'w-full h-full object-cover',
                    isAnimating && 'blur-[2px]'
                  )}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />
              ) : null}
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground text-3xl font-bold',
                  displayUser.github && 'hidden'
                )}
              >
                {displayUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>

            <h3
              className={cn(
                'text-2xl font-bold text-foreground mb-2 flex items-center gap-2',
                isAnimating && 'blur-sm'
              )}
            >
              {displayUser.name}
              {displayUser.github && reminderUsers.has(displayUser.github) && (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </h3>
            {displayUser.github && (
              <a
                href={`https://github.com/${displayUser.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-sm text-muted-foreground hover:text-primary transition-colors',
                  isAnimating && 'blur-sm pointer-events-none'
                )}
              >
                @{displayUser.github}
              </a>
            )}
          </motion.div>
        )}
      </div>

      {/* Final reveal animation */}
      {!isAnimating && (
        <motion.div
          className="absolute inset-0 bg-primary/20 pointer-events-none"
          initial={{ opacity: 1, scale: 1.5 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.div>
  );
}
