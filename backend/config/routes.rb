Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"
  get "/staff_directory", to: "staff_directory#index"

  get "/me", to: "users#me"
  patch "/me", to: "users#update_me"

  resources :members, only: %i[index create show update] do
    resources :old_numbers, only: %i[create destroy], controller: "old_member_numbers"
  end

  post "/spin", to: "spins#create"
  get "/winners", to: "winners#index"

  namespace :admin do
    resources :users, only: %i[index create update]
    get "/audit_log", to: "audit_log#index"
  end
end
