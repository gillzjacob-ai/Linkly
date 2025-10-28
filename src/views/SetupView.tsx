import React, { useEffect, useMemo, useState } from 'react';
import { AdjustmentsHorizontalIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/Button';
import { ProfileCard } from '../components/ProfileCard';
import { useAppContext } from '../context/AppContext';
import type { MatchPreferences, UserProfile } from '../types';

interface SetupViewProps {
  showHeader?: boolean;
}

const DEFAULT_PREFERENCES: MatchPreferences = {
  genders: ['everyone'],
  ageRange: [24, 34],
  maxDistance: 25,
};

const genderOptions = [
  { label: 'Men', value: 'man' },
  { label: 'Women', value: 'woman' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Everyone', value: 'everyone' },
];

export const SetupView: React.FC<SetupViewProps> = ({ showHeader = true }) => {
  const { profile, saveProfile } = useAppContext();
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age ?? 25);
  const [genderIdentity, setGenderIdentity] = useState<UserProfile['genderIdentity']>(
    profile?.genderIdentity ?? 'woman',
  );
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [verified, setVerified] = useState(profile?.verified ?? false);
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatarSeed ?? 'linkly-user');
  const [preferences, setPreferences] = useState<MatchPreferences>(
    profile?.preferences ?? DEFAULT_PREFERENCES,
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!profile) {
      const randomSeed = `linkly-${Math.random().toString(36).slice(2, 8)}`;
      setAvatarSeed(randomSeed);
    }
  }, [profile]);

  const selectedGenders = useMemo(() => new Set(preferences.genders), [preferences.genders]);

  const toggleGenderPreference = (value: MatchPreferences['genders'][number]) => {
    setPreferences((prev) => {
      if (value === 'everyone') {
        return { ...prev, genders: ['everyone'] };
      }
      const next = new Set(prev.genders);
      if (next.has('everyone')) {
        next.delete('everyone');
      }
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      if (next.size === 0) {
        next.add(value);
      }
      return { ...prev, genders: Array.from(next) as MatchPreferences['genders'] };
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasSubmitted(true);
    if (!name.trim() || !bio.trim()) {
      return;
    }
    const nextProfile: UserProfile = {
      id: profile?.id ?? crypto.randomUUID(),
      name: name.trim(),
      age,
      genderIdentity,
      bio: bio.trim(),
      avatarSeed,
      verified,
      preferences,
    };
    saveProfile(nextProfile);
  };

  const verificationHint = verified
    ? 'You are verified! Matches will see your shield badge.'
    : 'Tap to simulate identity verification and earn trust badges.';

  const previewProfile: UserProfile = {
    id: profile?.id ?? 'preview',
    name: name || 'Your name',
    age,
    bio: bio || 'Share a quick vibe-check blurb so matches know what to expect.',
    avatarSeed,
    genderIdentity,
    verified,
    preferences,
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-24">
      {showHeader && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Let\'s set up your vibe</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Build a quick profile so we can queue you up with people who want the same kind of conversation.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile basics</h3>
              <button
                type="button"
                onClick={() => setAvatarSeed(`linkly-${Math.random().toString(36).slice(2, 8)}`)}
                className="text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Shuffle avatar
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Display name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Taylor Swiftie"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {hasSubmitted && !name.trim() && (
                  <span className="text-xs font-medium text-red-500">Please enter a display name.</span>
                )}
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Age
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={age}
                  onChange={(event) => setAge(Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Gender identity
                <select
                  value={genderIdentity}
                  onChange={(event) => setGenderIdentity(event.target.value as UserProfile['genderIdentity'])}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Bio
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Two truths, one lie. I\'ll go first."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {hasSubmitted && !bio.trim() && (
                  <span className="text-xs font-medium text-red-500">Let people know what kind of chat you\'re into.</span>
                )}
              </label>
            </div>
            <button
              type="button"
              onClick={() => setVerified((prev) => !prev)}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand transition hover:bg-brand/20 dark:bg-brand/20 dark:text-brand-light"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              {verified ? 'Verified badge activated' : 'Simulate verification'}
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{verificationHint}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Match preferences</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Set who you\'d like to meet so Linkly can queue the right people.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleGenderPreference(option.value as MatchPreferences['genders'][number])}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedGenders.has(option.value as never) ? 'bg-brand text-white shadow-glow' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Age minimum
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={preferences.ageRange[0]}
                  onChange={(event) =>
                    setPreferences((prev) => ({
                      ...prev,
                      ageRange: [Number(event.target.value), prev.ageRange[1]],
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Age maximum
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={preferences.ageRange[1]}
                  onChange={(event) =>
                    setPreferences((prev) => ({
                      ...prev,
                      ageRange: [prev.ageRange[0], Number(event.target.value)],
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Max distance (km)
              <input
                type="range"
                min={5}
                max={100}
                value={preferences.maxDistance}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, maxDistance: Number(event.target.value) }))
                }
                className="accent-brand"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Within {preferences.maxDistance} km
              </span>
            </label>
          </div>
        </div>
        <div className="space-y-6">
          <ProfileCard
            profile={previewProfile}
            footer={
              <div className="text-xs text-slate-500 dark:text-slate-400">
                This is what your match sees when they tap your name during a chat.
              </div>
            }
          />
          <Button type="submit" fullWidth>
            {profile ? 'Save profile changes' : 'Create my Linkly profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};
