"use client";
import Link from "next/link";
import GithubCorner from "react-github-corner";

export default function HomePage() {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen bg-gradient-to-r from-gray-300 to-red-200">
        <GithubCorner
          href={`https://github.com/MehmetBozkir`}
          bannerColor="#151513"
          octoColor="#fff"
          size={80}
          direction="right"
          target="_blank"
        />
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold ">
              Welcome <br /> To <br />
              To-Do App
            </h1>
            <p className="py-6">Please login to manage your tasks.</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center bg-primary text-white rounded-full overflow-hidden">
                <Link href="/login" className="btn btn-primary rounded-none">
                  <p className="px-4">Login</p>
                </Link>
                <div className="border-l border-white h-full"></div>
                <Link href="/register" className="btn btn-primary rounded-none">
                  <p className="px-4">Register</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
