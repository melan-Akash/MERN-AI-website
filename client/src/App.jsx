import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImage from './pages/GenerateImage'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObjects from './pages/RemoveObjects'
import ReviweCV from './pages/ReviweCV'
import Community from './pages/Community'


const App = () => {
  return (
    <Routes>
      
      <Route path='/' element={<Home />} />

     
      <Route path='/ai' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='write-article' element={<WriteArticle />} />
        <Route path='blog-titles' element={<BlogTitles />} />
        <Route path='generate-images' element={<GenerateImage />} />
        <Route path='remove-background' element={<RemoveBackground />} />
        <Route path='remove-object' element={<RemoveObjects />} />
        <Route path='review-resume' element={<ReviweCV />} />
        <Route path='community' element={<Community />} />
      </Route>
    </Routes>
  )
}

export default App
