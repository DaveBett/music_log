class DebugPost
  def initialize(app)
    @app = app
  end

  def call(env)
    puts ">>> #{env['REQUEST_METHOD']} #{env['PATH_INFO']}"
    @app.call(env)
  end
end

Rails.application.config.middleware.insert_before 0, DebugPost
