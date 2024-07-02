"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import GithubCorner from "react-github-corner";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";

function TodosPage() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const todosPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTodos();
  }, [token, router, currentPage, searchTerm, filterTag]);

  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:5000/api/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let filteredTodos = response.data;

    if (searchTerm) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTag) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.tags.includes(filterTag)
      );
    }

    const offset = currentPage * todosPerPage;
    const paginatedTodos = filteredTodos.slice(offset, offset + todosPerPage);

    setTodos(paginatedTodos);
    setPageCount(Math.ceil(filteredTodos.length / todosPerPage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (isEditing && currentTodo) {
        const response = await axios.put(
          `http://localhost:5000/api/todos/${currentTodo._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTodos(
          todos.map((todo) =>
            todo._id === currentTodo._id ? response.data : todo
          )
        );
        toast.success("To-Do updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/todos",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTodos([...todos, response.data]);
        setTitle("");
        setDescription("");
        setTags("");
        setThumbnail(null);
        toast.success("To-Do added successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save To-Do.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.error("To-Do deleted!");
    } catch (error) {
      toast.error("Failed to delete To-Do.");
    }
  };

  const handleEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setTags(todo.tags.join(", "));
    setShowForm(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentTodo(null);
    setTitle("");
    setDescription("");
    setTags("");
    setThumbnail(null);
    setShowForm(false);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="bg-gradient-to-t from-gray-400 to-teal-900 min-h-screen">
      <GithubCorner
        href={`https://github.com/MehmetBozkir`}
        bannerColor="#151513"
        octoColor="#fff"
        size={80}
        direction="right"
        target="_blank"
      />
      <Toaster position="bottom-right" reverseOrder={false} />
      <h2 className="text-center text-6xl text-white">To-Do</h2>
      <div className="flex justify-center items-center mt-12 mb-4 ml-28">
        <div className="space-x-4 flex px-10 bg-white rounded-full bg-opacity-20">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered"
          />
          <input
            type="text"
            placeholder="Search by tags"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="input input-bordered"
          />
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            New ToDo
          </button>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {isEditing ? "Edit To-Do" : "Add New To-Do"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Thumbnail</label>
                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  accept="image/*"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update To-Do" : "Add To-Do"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white bg-opacity-75 max-w-5xl flex mx-auto rounded-lg">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Description</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  {todo.thumbnail && (
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={`http://localhost:5000/uploads/${todo.thumbnail.filename}`}
                          alt={todo.title}
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="font-bold">{todo.title}</div>
                  </div>
                </td>
                <td>
                  <div className="tags">{todo.tags.join(", ")}</div>
                </td>
                <td>{todo.description}</td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs hover:text-white hover:bg-blue-600"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-xs hover:text-white hover:bg-red-600"
                    onClick={() => handleDelete(todo._id)}
                  >
                    Delete
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Description</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center ml-80"}
        activeClassName={
          "flex justify-end border-gray-300 border-2 text-blue-400"
        }
        pageClassName={"page-item hover:text-blue-400 p-2"}
      />
    </div>
  );
}

export default function ProtectedTodosPage() {
  return (
    <ProtectedRoute>
      <TodosPage />
    </ProtectedRoute>
  );
}
