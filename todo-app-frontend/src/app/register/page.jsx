"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import GithubCorner from "react-github-corner";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = registerSchema.safeParse({ username, password });
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      await register(username, password);
      router.push("/login");
    } catch (error) {
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen bg-gradient-to-r from-gray-300 to-blue-300">
        <GithubCorner
          href={`https://github.com/MehmetBozkir`}
          bannerColor="#151513"
          octoColor="#fff"
          size={80}
          direction="right"
          target="_blank"
        />
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p className="py-6">
              Email confirmation is not required and notifications are not sent
              to the email used, so a random email that complies with email
              standards can be used.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input input-bordered"
                  required
                />
                {formErrors.username && (
                  <p className="text-red-500 text-xs mt-2">
                    {formErrors.username._errors.join(", ")}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="input input-bordered w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-3 flex items-center bg-primary"
                  >
                    {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-2">
                    {formErrors.password._errors.join(", ")}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                )}
                <label className="label">
                  <a href="/login" className="label-text-alt link link-hover">
                    Already have an account?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
