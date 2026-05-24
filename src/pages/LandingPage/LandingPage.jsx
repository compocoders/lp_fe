import React from 'react';
import { Rocket } from 'lucide-react';
import Button from '../../components/common/Button/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <header className="p-6 sticky top-0 z-50">
        <div className="glass-panel flex justify-between items-center px-8 py-4 max-w-6xl mx-auto">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-gradient">LearnPlatform</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-400 font-medium transition-colors hover:text-white">Features</a>
            <a href="#about" className="text-slate-400 font-medium transition-colors hover:text-white">About</a>
          </nav>
          <div className="flex gap-4">
            <Button variant="secondary">Log In</Button>
            <Button variant="primary">Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="text-center max-w-3xl animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm font-medium mb-6 border border-purple-500/20">
            ✨ Welcome to the future of learning
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Master any skill, <br />
            <span className="text-gradient">anywhere, anytime.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of learners achieving their goals with our industry-leading platform. 
            Experience learning like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary">
              <Rocket size={20} />
              Start Learning Now
            </Button>
            <Button variant="secondary">View Courses</Button>
          </div>
        </div>
      </main>

      {/* Decorative background blur elements */}
      <div className="absolute w-[400px] h-[400px] bg-brand-primary rounded-full blur-[120px] opacity-50 -top-24 -right-24 z-0"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-500 rounded-full blur-[120px] opacity-50 bottom-0 -left-12 z-0"></div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default LandingPage;
