import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead 
        title="Terms of Service" 
        description="Read the Terms of Service for The Daily Pulse. By using our website, you agree to these terms and conditions." 
        url="https://articleblogwebsite.web.app/terms" 
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white">Terms of Service</span>
        </nav>
        
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight font-heading">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using BlogForge, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h2>2. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, BlogForge and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>

          <h2>3. User Content</h2>
          <p>In these Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant BlogForge a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
          <p>Your Content must be your own and must not be invading any third-party's rights. BlogForge reserves the right to remove any of Your Content from this Website at any time without notice.</p>

          <h2>4. Advertising Disclosure</h2>
          <p>This website uses advertising services, including Google AdSense, to provide revenue. These services may use cookies and other tracking technologies to serve ads based on your prior visits to this website or other websites. Please refer to our Privacy Policy and Cookie Policy for more detailed information regarding advertising.</p>

          <h2>5. Disclaimers and Limitation of Liability</h2>
          <p>This Website is provided "as is," with all faults, and BlogForge express no representations or warranties, of any kind related to this Website or the materials contained on this Website. In no event shall BlogForge, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website.</p>
          
          <h2>6. Governing Law</h2>
          <p>These Terms will be governed by and interpreted in accordance with the laws of the State, and you submit to the non-exclusive jurisdiction of the state and federal courts located in the State for the resolution of any disputes.</p>
        </div>
      </div>
    </div>
  );
}
