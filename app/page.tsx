export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Mock Interviewer - MERN Stack</h1>
        <p className="text-gray-600 mb-4">
          This is a MERN stack application. The main application runs in the client folder.
        </p>
        <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">To run the application:</h2>
          <div className="text-left space-y-2">
            <p>
              <strong>1.</strong> Install dependencies:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">npm run install-deps</code>
            </p>
            <p>
              <strong>2.</strong> Start development: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
            </p>
            <p>
              <strong>3.</strong> Frontend: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
            </p>
            <p>
              <strong>4.</strong> Backend: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Environment Variables Required:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              <strong>Frontend (.env in client folder):</strong> Firebase config variables
            </p>
            <p>
              <strong>Backend (.env in server folder):</strong> MongoDB URI, Firebase Admin SDK, Gemini API key
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
