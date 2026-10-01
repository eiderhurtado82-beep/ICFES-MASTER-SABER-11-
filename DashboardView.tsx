import React from 'react';
import { HomeView } from './HomeView';

/**
 * DashboardView is the main student control panel view.
 * It detects payment return parameters (?success=true, ?canceled=true),
 * triggers celebration animations, and displays learning analytics.
 */
export const DashboardView: React.FC = () => {
  return <HomeView />;
};

export default DashboardView;
