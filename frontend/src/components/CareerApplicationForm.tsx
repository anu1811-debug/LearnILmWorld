import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface Props {
    onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CareerApplicationForm({ onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [customRole, setCustomRole] = useState("");
    const [status, setStatus] = useState<"success" | "error" | null>(null);

    // 🔹 FORM STATES
    const [name, setName] = useState("");
    const [education, setEducation] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // 🔹 File → base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeFile) {
            alert("Resume is required");
            return;
        }

        try {
            setLoading(true);
            setStatus(null);

            const resumeBase64 = await fileToBase64(resumeFile);

            const finalRole = role === "Other" ? customRole : role;


            const payload = {
                name,
                education,
                role: finalRole,
                email,
                phone,
                resumeBase64,
                resumeFileName: resumeFile.name,
            };

            const res = await fetch(`${API_URL}/api/careers/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-[#254999] via-[#5a7bb0] to-[#b5c5db] rounded-[2.5rem] p-8 w-[90%] max-w-md  relative shadow-2xl"
    >
        {/* Close */}
        <button
            onClick={onClose}
            className="absolute top-5 right-6 text-3xl font-light text-white/80 hover:text-white transition"
        >
            ×
        </button>

        <h2 className="text-[1.35rem] font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
            Apply to Join LearniLM <span className="text-xl">🌍</span> World
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
                {/* <label className="text-white text-sm font-semibold pl-1">Name</label> */}
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                />
            </div>

            {/* Highest Qualification */}
            <div className="flex flex-col gap-1.5">
                {/* <label className="text-white text-sm font-semibold pl-1">Highest Qualification</label> */}
                <input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="Education (e.g. B.Tech, MBA)"
                    required
                    className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
                {/* <label className="text-white text-sm font-semibold pl-1">Role</label> */}
                <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        if (e.target.value !== "Other") {
                            setCustomRole("");
                        }
                    }}
                    required
                    className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd] cursor-pointer"
                >
                    <option value="" disabled hidden>Select Role</option>

                    {/* Core Internship Roles */}
                    <option value="Full Stack Developer Intern">Full Stack Developer Intern</option>
                    <option value="UI/UX Design Intern">UI/UX Design Intern</option>
                    <option value="Q/A Intern">Q/A Intern</option>
                    <option value="Digital Marketing Intern">Digital Marketing Intern</option>
                    <option value="Content Creator Intern">Content Creator Intern</option>

                    {/* Sales Roles */}
                    <option value="Sales Intern - India">Sales Intern – India</option>
                    <option value="Sales Intern - Bahrain">Sales Intern – Bahrain</option>
                    <option value="Sales Intern - Kuwait">Sales Intern – Kuwait</option>
                    <option value="Sales Intern - Oman">Sales Intern – Oman</option>
                    <option value="Sales Intern - Jordan">Sales Intern – Jordan</option>
                    <option value="Sales Intern - Azerbaijan">Sales Intern – Azerbaijan</option>
                    <option value="Sales Intern - Belarus">Sales Intern – Belarus</option>

                    {/* Other */}
                    <option value="Other">Other (Specify)</option>
                </select>
            </div>

            {role === "Other" && (
                <div className="flex flex-col gap-1.5 pt-1">
                    <input
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="Enter the role you are applying for"
                        required
                        className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                    />
                </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                {/* <label className="text-white text-sm font-semibold pl-1">Email</label> */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
                {/* <label className="text-white text-sm font-semibold pl-1">Phone Number</label> */}
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your number"
                    required
                    className="w-full px-4 py-3 rounded-3xl bg-white border border-[#5186cd]/30 focus:outline-none focus:ring-2 focus:ring-[#5186cd]"
                />
            </div>

            {/* Custom File Upload Button */}
            <div className="pt-2">
                <div className="relative inline-flex items-center bg-white rounded-full pl-1.5 pr-4 py-1 shadow-sm cursor-pointer hover:bg-gray-50 transition">
                    <div className="bg-[#5c4eba] rounded-full p-1.5 mr-2">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                    </div>
                    <span className="text-gray-800 text-sm font-medium">
                        {resumeFile ? resumeFile.name : "Choose File"}
                    </span>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center pt-6">
                <button
                    disabled={loading}
                    className="w-[85%] bg-[#024aac] hover:bg-[#033e90] text-white font-bold py-3 rounded-3xl hover:scale-105 transition"
                >
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </div>
        </form>

        {status === "success" && (
            <p className="text-green-900 bg-green-100/90 py-2 px-4 rounded-xl mt-6 text-center font-semibold text-sm">
                ✅ Application submitted successfully!
            </p>
        )}

        {status === "error" && (
            <p className="text-red-900 bg-red-100/90 py-2 px-4 rounded-xl mt-6 text-center font-semibold text-sm">
                ❌ Submission failed. Try again.
            </p>
        )}
    </motion.div>
</div>
    );
}
