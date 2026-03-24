import './App.css'
import { useEffect } from 'react'
import Home from './components/Home'
import { Routes, Route, useLocation } from "react-router-dom"
import Footer from './components/Footer'
import NewsDetail from './components/NewsDetail'
import Navbar from './components/Navbar'
import SearchPage from './components/SearchPage'
import Login from './components/Login'
import Signup from './components/Signup'

import VideoPage from './components/VideoPage'
import EPaperPage from './components/EPaperPage'
import WebStoryPage from './components/WebStoryPage'
import ChangePassword from './components/ChangePassword'

import AboutUs from './components/AboutUs'
import Contact from './components/Contact'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsCondition from './components/TermsCondition'

import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminNews from './components/admin/AdminNews'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminVideos from './components/admin/AdminVideos'
import AdminWebStory from './components/admin/AdminWebStory'
import AdminCategories from './components/admin/AdminCatagories'
import AdminUsers from './components/admin/AdminUser'
import AdminRoles from './components/admin/AdminRoles'
// import AdminMedia from './components/admin/AdminMedia'
import AdminComments from './components/admin/AdminComments'
import AdminSettings from './components/admin/AdminSettings'
import AdminAds from './components/admin/AdminAds'
import ScrollToTop from './components/ScrollToTop'
import { Helmet } from 'react-helmet-async'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      <Helmet>
        <title>Aaj Ka Mudda - Breaking News & Latest Updates</title>
        <meta name="description" content="Aaj Ka Mudda delivers the latest breaking news, videos, web stories, and in-depth analysis across India and the globe." />
        <meta property="og:title" content="Aaj Ka Mudda - Breaking News & Latest Updates" />
        <meta property="og:type" content="website" />
      </Helmet>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/category/:categoryName" element={<Home />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path="/videos" element={<VideoPage />} />
        <Route path="/epaper" element={<EPaperPage />} />
        <Route path="/webstory" element={<WebStoryPage />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsCondition />} />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="webstory" element={<AdminWebStory />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="ads" element={<AdminAds />} />
          {/* <Route path="media" element={<AdminMedia />} /> */}
          <Route path="settings" element={<AdminSettings />} />
        </Route>

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
