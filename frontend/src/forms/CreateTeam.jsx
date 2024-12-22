/* eslint-disable react/prop-types */
const CreateTeamForm = ({ data, setData, nextStep }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        nextStep();
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Create Team</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Team Name</label>
        <input
          type="text"
          value={data.teamName}
          onChange={(e) => setData({ ...data, teamName: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          rows="4"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-600"
      >
        Next
      </button>
    </form>
  );
};

export default CreateTeamForm;

