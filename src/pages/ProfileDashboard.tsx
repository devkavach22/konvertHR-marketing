import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserContactsApi, updateUserContact } from "./SubScriptionService";
import { useToast } from "../components/common/ToastContext";

export interface ProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  name: string;
  designation: string;
}

/* ================= FIELD COMPONENT ================= */

interface FieldProps {
  label: string;
  name: keyof ProfilePayload;
  value?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isEdit: boolean;
}

const Field: React.FC<FieldProps> = React.memo(
  ({ label, name, value, readOnly = false, onChange, error, isEdit }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>

      {isEdit ? (
        <input
          name={name}
          value={value || ""}
          readOnly={readOnly}
          onChange={readOnly ? undefined : onChange}
          className={`rounded-lg px-4 py-2 border
            ${readOnly
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white"
            }
            ${error ? "border-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-2 focus:ring-red-500`}
        />
      ) : (
        <div className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800">
          {value || "-"}
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
);

/* ================= PROFILE DASHBOARD ================= */

const ProfileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactId, setContactId] = useState<string | null>(null);

  /* ================= REACT HOOK FORM ================= */

  const {
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProfilePayload>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      designation: "",
    },
  });

  const form = watch();

  /* ================= FETCH CONTACTS ================= */

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = (await getUserContactsApi()) as any;

        const primaryContact = data?.contacts?.[0];
        if (!primaryContact) return;

        // Store contactId for later use
        if (primaryContact.id) {
          setContactId(String(primaryContact.id));
          localStorage.setItem("contactId", String(primaryContact.id));
        }

        const fullName = primaryContact.name || "";
        const nameArr = fullName.trim().split(" ");

        reset({
          first_name: nameArr[0] || "",
          last_name: nameArr.slice(1).join(" ") || "",
          email: primaryContact.email || "",
          mobile: primaryContact.mobile || primaryContact.phone || "",
          designation:
            primaryContact.job_position || primaryContact.job_position,
        });
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [reset, location]);

  /* ================= SAVE HANDLER ================= */

  const onSubmit = async (data: ProfilePayload) => {
    const userId = localStorage.getItem("userId");
    const storedContactId = contactId || localStorage.getItem("contactId");

    if (!userId || !storedContactId) {
      showToast("User or contact ID not found", "error");
      return;
    }

    try {
      await updateUserContact({
        user_id: userId,
        contact_id: storedContactId,
        payload: {
          name: `${data.first_name} ${data.last_name}`.trim(),
          email: data.email,
          mobile: data.mobile,
          function: data.designation,
        },
      });
      setIsEdit(false);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error("Failed to update profile", err);
      showToast("Failed to update profile", "error");
    }
  };

  if (loading) return null;

  /* ================= UI ================= */

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">
              {form.first_name?.[0]}
              {form.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {form.first_name} {form.last_name}
              </h2>
              <p className="text-sm text-gray-500">{form.designation || "-"}</p>
            </div>
          </div>

          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className="inline-flex items-center gap-2 bg-white text-[#E42128] px-6 py-3 rounded-full font-semibold hover:bg-[#ffe6e6]"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#E42128] text-left mb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={(e) => reset({ ...form, first_name: e.target.value })}
              error={errors.first_name?.message}
              isEdit={isEdit}
            />

            <Field
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={(e) => reset({ ...form, last_name: e.target.value })}
              error={errors.last_name?.message}
              isEdit={isEdit}
            />

            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 items-end">
              <Field
                label="Email"
                name="email"
                value={form.email}
                readOnly
                isEdit={false}
              />

              <button
                onClick={() =>
                  navigate("/send-otp", {
                    state: {
                      type: "email",
                      value: form.email, // ✅ pass current email
                    },
                  })
                }
                className="h-9 px-3 bg-[#E42128] text-white text-xs font-semibold rounded-md hover:bg-red-700"
              >
                Change
              </button>

              <Field
                label="Mobile Number"
                name="mobile"
                value={form.mobile}
                readOnly
                isEdit={false}
              />

              <button
                onClick={() =>
                  navigate("/send-otp", {
                    state: {
                      type: "mobile",
                      value: form.mobile, // ✅ pass current mobile
                    },
                  })
                }
                className="h-9 px-3 bg-[#E42128] text-white text-xs font-semibold rounded-md hover:bg-red-700"
              >
                Change
              </button>
            </div>

            <Field
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={(e) => reset({ ...form, designation: e.target.value })}
              error={errors.designation?.message}
              isEdit={isEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
