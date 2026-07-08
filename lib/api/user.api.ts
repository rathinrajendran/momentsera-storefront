const API = process.env.NEXT_PUBLIC_API!;

export const fetchMyProfile = async (token: string) => {
  const res = await fetch(`${API}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
};

export const updateMyProfile = async (
  token: string,
  patch: { full_name?: string; phone?: string }
) => {
  const res = await fetch(`${API}/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const fetchMyEvents = async (token: string) => {
  const res = await fetch(`${API}/user/me/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
};