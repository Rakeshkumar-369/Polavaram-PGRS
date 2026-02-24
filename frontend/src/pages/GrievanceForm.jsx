import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function GrievanceForm() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [issueTypes, setIssueTypes] = useState([]);
  const [units, setUnits] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [habitations, setHabitations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    aadhaar: "",
    fatherName: "",
    mobile: "",
    category: "",
    priority: "",
    description: "",
    issue_type_id: "",
    unit_id: "",
    relation_type: "",
    relative_name: "",
    beneficiary_type: "",
    age: "",
    caste: "",
    occupation: "",
    district_id: "",
    mandal_id: "",
    village_id: "",
    habitation_id: "",
  });

  // -------- LOAD ISSUE TYPES --------
  useEffect(() => {
    if (user?.wing_id === 2) {
      api.get("/issue-types").then(res => setIssueTypes(res.data)).catch(()=>{});
    }
  }, [user]);

  // -------- LOAD UNITS --------
  useEffect(() => {
    if (user?.wing_id === 1 && user?.designation_id !== 3) {
      api.get("/units").then(res => setUnits(res.data)).catch(()=>{});
    }
  }, [user]);

  // -------- LOAD DISTRICTS --------
  useEffect(() => {
    api.get("/geo/districts").then(res => setDistricts(res.data)).catch(()=>{});
  }, []);

  // -------- DISTRICT CHANGE --------
  useEffect(() => {
    if (formData.district_id) {
      api.get(`/geo/mandals/${formData.district_id}`)
        .then(res => setMandals(res.data))
        .catch(()=>{});
    }
  }, [formData.district_id]);

  // -------- MANDAL CHANGE --------
  useEffect(() => {
    if (formData.mandal_id) {
      api.get(`/geo/villages/${formData.mandal_id}`)
        .then(res => setVillages(res.data))
        .catch(()=>{});
    }
  }, [formData.mandal_id]);

  // -------- VILLAGE CHANGE --------
  useEffect(() => {
    if (formData.village_id) {
      api.get(`/geo/habitations/${formData.village_id}`)
        .then(res => setHabitations(res.data))
        .catch(()=>{});
    }
  }, [formData.village_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: value };

    // Cascade reset
    if (name === "district_id") {
      updated.mandal_id = "";
      updated.village_id = "";
      updated.habitation_id = "";
      setMandals([]);
      setVillages([]);
      setHabitations([]);
    }

    if (name === "mandal_id") {
      updated.village_id = "";
      updated.habitation_id = "";
      setVillages([]);
      setHabitations([]);
    }

    if (name === "village_id") {
      updated.habitation_id = "";
      setHabitations([]);
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/grievances", formData);
      setSuccess("Grievance submitted successfully.");

      setFormData({
        name: "",
        aadhaar: "",
        fatherName: "",
        mobile: "",
        category: "",
        priority: "",
        description: "",
        issue_type_id: "",
        unit_id: "",
        relation_type: "",
        relative_name: "",
        beneficiary_type: "",
        age: "",
        caste: "",
        occupation: "",
        district_id: "",
        mandal_id: "",
        village_id: "",
        habitation_id: "",
      });

    } catch (error) {
      setError(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">New Grievance Entry</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {success && <div className="mb-4 text-green-600 text-sm text-center">{success}</div>}
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* R&R issue type */}
          {user?.wing_id === 2 && (
            <div className="col-span-2">
              <label>Issue Type</label>
              <select name="issue_type_id" value={formData.issue_type_id} onChange={handleChange} required className="w-full border rounded p-2">
                <option value="">Select</option>
                {issueTypes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          )}

          {/* LA unit */}
          {user?.wing_id === 1 && user?.designation_id !== 3 && (
            <div className="col-span-2">
              <label>Unit</label>
              <select name="unit_id" value={formData.unit_id} onChange={handleChange} required className="w-full border rounded p-2">
                <option value="">Select</option>
                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}

          {/* Geo cascade */}
          <select name="district_id" value={formData.district_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">District</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <select name="mandal_id" value={formData.mandal_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Mandal</option>
            {mandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          <select name="village_id" value={formData.village_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Village</option>
            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>

          <select name="habitation_id" value={formData.habitation_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Habitation</option>
            {habitations.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded"/>
          <input name="aadhaar" placeholder="Aadhaar" value={formData.aadhaar} onChange={handleChange} maxLength="12" required className="border p-2 rounded"/>

          <select name="relation_type" value={formData.relation_type} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Relation</option>
            <option>S/o</option><option>D/o</option><option>W/o</option><option>C/o</option>
          </select>

          <input name="relative_name" placeholder="Relative Name" value={formData.relative_name} onChange={handleChange} required className="border p-2 rounded"/>

          <select name="beneficiary_type" value={formData.beneficiary_type} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Beneficiary</option>
            <option>Individual</option><option>Group</option>
          </select>

          <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} className="border p-2 rounded"/>
          <input name="caste" placeholder="Caste" value={formData.caste} onChange={handleChange} className="border p-2 rounded"/>
          <input name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="border p-2 rounded"/>

          <input name="fatherName" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} required className="border p-2 rounded"/>
          <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} maxLength="10" required className="border p-2 rounded"/>

          <select name="category" value={formData.category} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Category</option>
            <option>Compensation</option>
            <option>Land Issue</option>
            <option>R&R Benefit</option>
          </select>

          <select name="priority" value={formData.priority} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Priority</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="col-span-2 border p-2 rounded"/>

          <button disabled={loading} className="col-span-2 bg-blue-800 text-white py-2 rounded">
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>
      </div>
    </Layout>
  );
}