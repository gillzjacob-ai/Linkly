import React from 'react';
import { ShieldCheckIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '../context/AppContext';
import type { MatchPartner, UserProfile } from '../types';

interface ProfileCardProps {
  profile: MatchPartner | UserProfile;
  footer?: React.ReactNode;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, footer }) => {
  const { getAvatarUrl } = useAppContext();
  const isVerified = profile.verified;
  const interests = 'interests' in profile ? profile.interests : undefined;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <img
          src={getAvatarUrl(profile.avatarSeed)}
          alt={profile.name}
          className="h-20 w-20 flex-shrink-0 rounded-2xl border border-slate-200 object-cover shadow dark:border-slate-700"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{profile.name}</h2>
            {isVerified && <ShieldCheckIcon className="h-5 w-5 text-brand" />}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {profile.age} • {profile.genderIdentity.replace('-', ' ')}
          </p>
          {'distance' in profile && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <MapPinIcon className="h-4 w-4" /> {profile.distance} km away
            </p>
          )}
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{profile.bio}</p>
        </div>
      </div>
      {interests && (
        <div className="mt-4 flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20 dark:text-brand-light"
            >
              <SparklesIcon className="h-4 w-4" />
              {interest}
            </span>
          ))}
        </div>
      )}
      {footer && <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">{footer}</div>}
    </article>
  );
};
