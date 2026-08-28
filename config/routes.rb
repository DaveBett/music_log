Rails.application.routes.draw do
  devise_for :users

  namespace :api do
    get    "musicbrainz/search"
    post   "register", to: "users#register"
    post   "login",    to: "users#login"
    delete "logout",   to: "users#logout"

    get    "me",              to: "users#me"
    patch  "me",              to: "users#update"
    patch  "me/password",     to: "users#update_password"
    delete "me",              to: "users#delete"
    patch  "me/avatar",       to: "users#update_avatar"

    patch "settings/password", to: "settings#password"
    delete "settings",         to: "settings#destroy"

    get "users/:username",         to: "users#show"
    get "users/:username/reviews", to: "reviews#user_reviews"
    get "users/:username/followers", to: "users#followers"
    get "users/:username/following", to: "users#following_list"

    get "profile",                 to: "users#profile"

    get "feed",   to: "feed#index"
    get "search", to: "search#index"

    get "musicbrainz/search", to: "music_brainz#search"

    post "/entries/:entry_id/review", to: "reviews#create"

    get "/verify-email",         to: "email_verifications#show"
    post "/verify-email/resend", to: "email_verifications#resend"
    post "/resend-confirmation", to: "users#resend_confirmation"

    get "trending", to: "home#trending"

    post  "password/forgot", to: "password_resets#create"
    patch "password/reset",  to: "password_resets#update"

    get   "notifications",           to: "notifications#index"
    patch "notifications/mark_read", to: "notifications#mark_read"

    resources :entries do
      resource :review, only: %i[show create]
    end

    resources :reviews, only: %i[index show update destroy]

    resources :reviews do
      resources :comments, only: [ :index, :create, :destroy ]
    end

    resources :users, only: :index do
      resource :follow, only: [ :create, :destroy ]
      get :followers, on: :member
      get :following, on: :member
    end

    resource :settings, only: [ :show, :update ]
  end
end
