Rails.application.routes.draw do
  get "entries", to: "entries#index"
  namespace :api do
    resources :entries
  end
  root "api/entries#index"
end
