import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Bell, Shield, Clock, CheckCircle, Users } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediReminder</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Never Miss Your 
                <span className="text-blue-600"> Medication</span> Again
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Take control of your health with our intelligent medication reminder system. 
                Track, manage, and never forget your daily medications with personalized notifications.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-center hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Start Free Today
                </Link>
                <Link 
                  to="/login"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">Aspirin 100mg</p>
                          <p className="text-white/80 text-sm">Take at 9:00 AM</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-400 ml-auto" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Bell className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">Vitamin D</p>
                          <p className="text-white/80 text-sm">Due in 2 hours</p>
                        </div>
                        <Clock className="h-6 w-6 text-yellow-400 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Healthy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive medication management system helps you maintain perfect adherence 
              to your treatment plan with intelligent reminders and detailed tracking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Pill className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Medication Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily add and manage all your medications with detailed scheduling, 
                dosage information, and personalized reminders tailored to your routine.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Reminders</h3>
              <p className="text-gray-600 leading-relaxed">
                Never miss a dose with our smart notification system that adapts to your 
                schedule and sends timely reminders across all your devices.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is protected with enterprise-grade security. 
                We never share your personal information with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Medication Adherence Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-blue-100">Reminders Sent</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust MediReminder to keep them on track with their medications.
          </p>
          <Link 
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold inline-block hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Get Started - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MediReminder</span>
            </div>
            <p className="text-gray-600">© 2025 MediReminder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;