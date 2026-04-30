import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ChevronRight } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead 
        title="Cookie Policy" 
        description="Understand how The Daily Pulse uses cookies, including essential, analytics, and advertising cookies like Google AdSense." 
        url="https://articleblogwebsite.web.app/cookies" 
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white">Cookie Policy</span>
        </nav>
        
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight font-heading">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <h2>1. What Are Cookies</h2>
          <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>

          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
          
          <h2>3. The Cookies We Set</h2>
          <ul>
            <li><strong>Essential Cookies:</strong> We use cookies for the management of the signup process, general administration, and to remember your login details so you don't have to log in every time you visit a new page.</li>
            <li><strong>Site Preferences Cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it.</li>
          </ul>

          <h2>4. Third-Party Cookies (Including Google AdSense)</h2>
          <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
          <ul>
            <li><strong>Analytics:</strong> This site uses analytics solutions to help us understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit.</li>
            <li><strong>Google AdSense / Advertising:</strong> The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more relevant ads across the web and limit the number of times that a given ad is shown to you. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.</li>
          </ul>
          <p>You may opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</p>

          <h2>5. Managing Cookies</h2>
          <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Therefore, it is recommended that you do not disable cookies.</p>

          <h2>6. More Information</h2>
          <p>Hopefully, that has clarified things for you. If there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
        </div>
      </div>
    </div>
  );
}
