"use client";

import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  AlertOctagon,
  Check,
  Trash2,
  Search,
  ThumbsUp,
  Filter,
  User,
  Home,
  Award,
  Smile,
  Meh,
  Frown,
  ExternalLink
} from 'lucide-react';

interface ReviewItem {
  id: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  comment: string;
  targetType: 'Property' | 'Landlord';
  targetName: string; // e.g. "Villa Tropical Cana" or "Anura Perera"
  date: string;
  likes: number;
  status: 'Approved' | 'Flagged' | 'Pending';
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "REV-901",
      authorName: "Sarah Connor",
      authorEmail: "sarah@connor.com",
      rating: 5,
      sentiment: "Positive",
      comment: "Absolutely breathtaking property. The Villa Tropical Cana has everything one could ask for. Spotless, quiet, and extremely modern. Highly recommended!",
      targetType: "Property",
      targetName: "Villa Tropical Cana",
      date: "May 23, 2026",
      likes: 24,
      status: "Approved"
    },
    {
      id: "REV-902",
      authorName: "John Conner",
      authorEmail: "john.c@cyberdyne.com",
      rating: 1,
      sentiment: "Negative",
      comment: "The host Anura Perera was highly unresponsive. We had to wait three hours in the rain for check-in. The water pressure in the shower was non-existent. Terrible experience.",
      targetType: "Landlord",
      targetName: "Anura Perera",
      date: "May 22, 2026",
      likes: 8,
      status: "Flagged"
    },
    {
      id: "REV-903",
      authorName: "Elena Rostova",
      authorEmail: "elena@rostov.io",
      rating: 4,
      sentiment: "Positive",
      comment: "Lovely stay at Colombo Heights Suite. Great view from the terrace and very convenient location. The host was generally polite, though checkout was slightly rushed.",
      targetType: "Property",
      targetName: "Colombo Heights Suite",
      date: "May 20, 2026",
      likes: 15,
      status: "Approved"
    },
    {
      id: "REV-904",
      authorName: "Arthur Dent",
      authorEmail: "arthur@guide.galaxy",
      rating: 3,
      sentiment: "Neutral",
      comment: "The place is mostly fine, but the instructions in the manual for the electrical panel were impossible to understand. Satisfactory but could use major clarity.",
      targetType: "Property",
      targetName: "46 Haunting St, Somerville",
      date: "May 18, 2026",
      likes: 3,
      status: "Pending"
    },
    {
      id: "REV-905",
      authorName: "Nimal Siri",
      authorEmail: "nimal@colombo.com",
      rating: 5,
      sentiment: "Positive",
      comment: "Nimal Bandara is an exceptional landlord. Professional, quick communication, and accommodated our early flight arrival without any issue. Absolute 5 stars!",
      targetType: "Landlord",
      targetName: "Nimal Bandara",
      date: "May 15, 2026",
      likes: 19,
      status: "Approved"
    },
    {
      id: "REV-906",
      authorName: "Lana Del",
      authorEmail: "lana@coast.com",
      rating: 2,
      sentiment: "Negative",
      comment: "Beautiful villa but the listing claimed it has heated pool. It was freezing cold and host refused to turn on heat. Felt highly deceptive.",
      targetType: "Property",
      targetName: "Ahlers & Ogletree Villa",
      date: "May 12, 2026",
      likes: 11,
      status: "Flagged"
    }
  ]);

  const [activeTab, setActiveTab] = useState<'All' | 'Property' | 'Landlord'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState<'All' | '5' | '4' | '3' | '2' | '1'>('All');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');

  // Rating Distribution statistics
  const totalReviewsCount = reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleFlag = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Flagged' } : r));
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    const matchesTab = activeTab === 'All' || r.targetType === activeTab;
    const matchesSearch =
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStar = starFilter === 'All' || r.rating.toString() === starFilter;
    const matchesSentiment = sentimentFilter === 'All' || r.sentiment === sentimentFilter;

    return matchesTab && matchesSearch && matchesStar && matchesSentiment;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* RATING OVERVIEW CARDS & BAR GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Card: Overall Platform Rating */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Average Platform Score</span>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-5xl font-extrabold text-gray-900 tracking-tight">4.85</h3>
              <span className="text-gray-400 font-extrabold text-lg">/ 5</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold select-none">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 uppercase">Total Submissions</p>
              <p className="text-gray-900 font-extrabold text-base">1,248 verified</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
              +0.04 MoM
            </span>
          </div>
        </div>

        {/* Middle: Star distribution analytics */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900">Rating Distribution</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Breakdown of customer sentiment levels</p>
          </div>

          <div className="space-y-2 select-none text-[10px] font-extrabold text-gray-500">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution] || 0;
              const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12 shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stars === 5 ? 'bg-emerald-400' :
                          stars === 4 ? 'bg-emerald-300' :
                            stars === 3 ? 'bg-amber-300' :
                              stars === 2 ? 'bg-amber-400' :
                                'bg-red-400'
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right font-extrabold text-gray-900">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Quick Moderation Queue metrics */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-gray-900">Compliance &amp; Moderation</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Policy compliance index &amp; speed</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-extrabold">
            <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4">
              <span className="text-[9px] text-red-500 uppercase tracking-widest block font-extrabold">Flagged Items</span>
              <span className="text-2xl font-extrabold text-red-600 block mt-1">{reviews.filter(r => r.status === 'Flagged').length}</span>
            </div>
            <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4">
              <span className="text-[9px] text-amber-600 tracking-widest block font-extrabold">Pending Moderation</span>
              <span className="text-2xl font-extrabold text-amber-700 block mt-1">{reviews.filter(r => r.status === 'Pending').length}</span>
            </div>
          </div>

          <div className="flex items-center text-[10px] text-gray-400 font-extrabold space-x-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Policy compliance is standard (100%)</span>
          </div>
        </div>

      </div>

      {/* DETAILED MODERATION GRID */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Toolbar Header */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h4 className="font-extrabold text-base text-gray-900">Moderation Portal</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit, flag, and remove property or landlord reviews</p>
            </div>

            {/* Target Tab controls */}
            <div className="bg-[#F8FAFB] p-1 rounded-2xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none border border-gray-100 sm:ml-4">
              {(['All', 'Property', 'Landlord'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${activeTab === tab ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {tab === 'All' ? 'All Reviews' : tab === 'Property' ? 'Properties' : 'Landlords'}
                </button>
              ))}
            </div>
          </div>

          {/* Filtering controls */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Stars rating filter */}
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-0.5 text-[9px] font-extrabold uppercase select-none border border-gray-50">
              <span className="text-gray-400 px-2 select-none font-extrabold uppercase text-[8px]">Stars</span>
              {['All', '5', '4', '3', '2', '1'].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarFilter(star as any)}
                  className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${starFilter === star ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {star === 'All' ? 'All' : `${star}★`}
                </button>
              ))}
            </div>

            {/* Sentiment filter */}
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-50">
              {['All', 'Positive', 'Neutral', 'Negative'].map((sent) => (
                <button
                  key={sent}
                  onClick={() => setSentimentFilter(sent as any)}
                  className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${sentimentFilter === sent ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {sent}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* REVIEWS GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 font-semibold">
              No platform reviews found matching your search.
            </div>
          ) : (
            filteredReviews.map((item) => (
              <div
                key={item.id}
                className={`border rounded-3xl p-6 transition flex flex-col justify-between space-y-6 hover:shadow-md ${item.status === 'Flagged' ? 'bg-red-50/10 border-red-100' :
                    item.status === 'Pending' ? 'bg-amber-50/10 border-amber-100' :
                      'bg-white border-gray-100'
                  }`}
              >
                {/* Upper Body: Identity and Target Entity */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A]/5 border border-gray-100 flex items-center justify-center font-extrabold text-sm select-none">
                        {item.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{item.authorName}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold">{item.authorEmail}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase border ${item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          item.sentiment === 'Neutral' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-red-50 text-red-600 border-red-100'
                        } flex items-center space-x-1`}>
                        {item.sentiment === 'Positive' && <Smile className="w-2.5 h-2.5 mr-0.5" />}
                        {item.sentiment === 'Neutral' && <Meh className="w-2.5 h-2.5 mr-0.5" />}
                        {item.sentiment === 'Negative' && <Frown className="w-2.5 h-2.5 mr-0.5" />}
                        <span>{item.sentiment} AI Index</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          item.status === 'Flagged' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Target Entity Segment */}
                  <div className="bg-[#F8FAFB] rounded-2xl p-4 border border-gray-50 flex justify-between items-center text-xs font-bold text-gray-800">
                    <div className="flex items-center space-x-2">
                      {item.targetType === 'Property' ? (
                        <Home className="w-4 h-4 text-purple-500 shrink-0" />
                      ) : (
                        <Award className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                      <div>
                        <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest block">{item.targetType} Target</span>
                        <span className="font-extrabold text-gray-900">{item.targetName}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 font-semibold text-[10px]">{item.date}</span>
                  </div>

                  {/* Rating Stars and Review Text */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 select-none">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= item.rating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed italic select-text">
                      "{item.comment}"
                    </p>
                  </div>
                </div>

                {/* Lower Action Row */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-3 text-xs select-none">
                  <div className="flex items-center text-[10px] text-gray-400 font-bold space-x-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-300" />
                    <span>{item.likes} users marked helpful</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.status !== 'Approved' && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 px-3.5 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center space-x-1"
                        title="Approve / Clear Flag"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {item.status !== 'Flagged' && (
                      <button
                        onClick={() => handleFlag(item.id)}
                        className="bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 px-3.5 py-2 rounded-xl font-extrabold transition cursor-pointer flex items-center space-x-1"
                        title="Flag under policy investigation"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Flag</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white p-2 rounded-xl font-extrabold transition cursor-pointer"
                      title="Deactivate and delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
