import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const get_entries = async () => {
  const response = await api.get("/entries");
  return response.data
}

export const create_entry = async (
  artist,
  title,
  year,
  musicbrainzId,
  musicbrainzUrl
) => {
  try {
    const response = await api.post("/entries", {
    entry: {
      artist,
      title,
      year,
      musicbrainz_id: musicbrainzId,
      musicbrainz_url: musicbrainzUrl
    }
  });

  return response.data;
  } catch (error) {
    throw error;
  }

}

export const delete_entry = async (id) => {
  const response = await api.delete(
    `/entries/${id}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export const update_entry = async (
  id,
  artist,
  title,
  year,
  musicbrainzId,
  musicbrainzUrl
) => {
  const response = await api.patch(
    `/entries/${id}`,
    {
      entry: {
        artist,
        title,
        year,
        musicbrainz_id: musicbrainzId,
        musicbrainz_url: musicbrainzUrl
      }
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
};

// User Auth

export const login = async (email, password) => {
  const response = await api.post("/login", {
    user: {
      email,
      password
    }
  });
  return response.data;
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register", {
      user: {
        username,
        email,
        password,
        password_confirmation: password,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  await api.delete("/logout");
};

export const me = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const updateMe = async (username, email) => {
  const response = await api.patch("/me", {
    user: {
      username,
      email
    }
  });

  return response.data;
};

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const deleteAccount = async () => {
  await api.delete("/settings");
};

export const updateProfile = async (username, email) => {
  const response = await api.patch("/me", {
    user: {
      username,
      email
    }
  });

  return response.data;
};

export const updatePassword = async (
  currentPassword,
  password,
  passwordConfirmation
) => {
  const response = await api.patch("/me/password", {
    user: {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation
    }
  });

  return response.data;
};

export const getPublicProfile = async (username) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

export const getFeed = async (type = "following") => {
  const response = await api.get("/feed", {
    params: {
      type,
    },
  });

  return response.data;
};

export const followUser = async (id) => {
  const response = await api.post(`/users/${id}/follow`);
  return response.data;
};

export const unfollowUser = async (id) => {
  const response = await api.delete(`/users/${id}/follow`);
  return response.data;
};

export async function getProfile() {
  const response = await api.get("/profile");
  return response.data;
}

export const search = async (query) => {
  const response = await api.get("/search", {
    params: { q: query }
  });

  return response.data;
};

export const getReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export const getUserReviews = async (username) => {
  const response = await api.get(
    `/users/${username}/reviews`
  );

  return response.data;
};

export const getReview = async (id) => {
  const response = await api.get(
    `/reviews/${id}`
  );

  return response.data;
};

export const createReview = async (
  entryId,
  title,
  rating,
  body
) => {
  const response = await api.post(
    `/entries/${entryId}/review`,
    {
      review: {
        title,
        rating: rating || null,
        body
      }
    }
  );

  return response.data;
};

export const updateReview = async (
  id,
  title,
  rating,
  body
) => {
  const response = await api.patch(
    `/reviews/${id}`,
    {
      review: {
        title,
        rating: rating || null,
        body
      }
    }
  );

  return response.data;
};

export const deleteReview = async (id) => {
  await api.delete(`/reviews/${id}`);
};

export const getComments = async (reviewId) => {
  const response = await api.get(
    `/reviews/${reviewId}/comments`
  );

  return response.data;
};

export const createComment = async (
  reviewId,
  body
) => {
  const response = await api.post(
    `/reviews/${reviewId}/comments`,
    {
      comment: {
        body
      }
    }
  );

  return response.data;
};

export const deleteComment = async (
  reviewId,
  commentId
) => {
  await api.delete(
    `/reviews/${reviewId}/comments/${commentId}`
  );
};

export const get_entry = async (id) => {
  const response = await api.get(
    `/entries/${id}`
  );

  return response.data;
};

export const searchMusicBrainz = async (query) => {
  const response = await api.get(
    "/musicbrainz/search",
    {
      params: {
        q: query
      }
    }
  );

  return response.data.albums;
};
  
export const getAlbumCoverUrl = (musicbrainzId) => {
  if (!musicbrainzId) {
    return null;
  }

  return `https://coverartarchive.org/release-group/${musicbrainzId}/front-250`;
};

export const verifyEmail = async (token) => {
  const response = await api.get(
    "/verify-email",
    {
      params: { token }
    }
  );

  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post(
    "/resend-confirmation",
    {
      email
    }
  );

  return response.data;
};