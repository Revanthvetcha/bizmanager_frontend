import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Placeholder Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Settings Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Settings page is under development. Check back later for configuration options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;