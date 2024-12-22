/* eslint-disable react/prop-types */


const CreateProjectForm = ({ data, setData, nextStep, backStep }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        nextStep();
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Create Project</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) => setData({ ...data, projectName: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={data.projectDescription}
          onChange={(e) =>
            setData({ ...data, projectDescription: e.target.value })
          }
          className="w-full border rounded-lg px-4 py-2"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Deadline</label>
        <input
          type="date"
          value={data.deadline}
          onChange={(e) => setData({ ...data, deadline: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={backStep}
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;

