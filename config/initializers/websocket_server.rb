fork { exec('node', Rails.root.join('lib/socket_server/server.js').to_s) }