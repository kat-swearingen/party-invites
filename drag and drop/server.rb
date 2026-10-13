#!/usr/bin/env ruby
# frozen_string_literal: true

require 'webrick'
require 'json'
require 'fileutils'
require 'socket'

PORT = (ENV['PORT'] || 8000).to_i
ROOT_DIR = File.expand_path(__dir__)
DATA_DIR = File.join(ROOT_DIR, 'data')
FileUtils.mkdir_p(DATA_DIR)

PARTY_FILE = File.join(DATA_DIR, 'party.json')
RSVPS_FILE = File.join(DATA_DIR, 'rsvps.json')

def local_ip
  orig = Socket.do_not_reverse_lookup
  Socket.do_not_reverse_lookup = true
  UDPSocket.open do |s|
    s.connect '8.8.8.8', 1
    s.addr.last
  end
rescue StandardError
  '127.0.0.1'
ensure
  Socket.do_not_reverse_lookup = orig
end

server = WEBrick::HTTPServer.new(
  Port: PORT,
  BindAddress: '0.0.0.0',
  AccessLog: [],
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN)
)

trap('INT') { server.shutdown }

# API: Health Check
server.mount_proc '/api/health' do |_req, res|
  res['Content-Type'] = 'application/json'
  res.body = { status: 'ok', server: 'PartyPortal Ruby Engine' }.to_json
end

# API: Party Configuration
server.mount_proc '/api/party' do |req, res|
  res['Content-Type'] = 'application/json'
  if req.request_method == 'POST'
    party_data = req.body
    File.write(PARTY_FILE, party_data)
    res.body = party_data
  else
    if File.exist?(PARTY_FILE)
      res.body = File.read(PARTY_FILE)
    else
      # Return default party from data.js or default template
      res.status = 404
      res.body = { error: 'No custom party saved yet' }.to_json
    end
  end
end

# API: RSVPs
server.mount_proc '/api/rsvps' do |req, res|
  res['Content-Type'] = 'application/json'
  if req.request_method == 'POST'
    rsvps_data = req.body
    File.write(RSVPS_FILE, rsvps_data)
    res.body = rsvps_data
  else
    if File.exist?(RSVPS_FILE)
      res.body = File.read(RSVPS_FILE)
    else
      res.body = [].to_json
    end
  end
end

# Static File Server for / and all assets
server.mount_proc '/' do |req, res|
  rel_path = req.path == '/' ? 'index.html' : req.path.sub(%r{^/}, '')
  # Sanitize to prevent directory traversal
  safe_path = File.expand_path(rel_path, ROOT_DIR)

  if safe_path.start_with?(ROOT_DIR) && File.file?(safe_path)
    ext = File.extname(safe_path).downcase
    res['Content-Type'] = case ext
                          when '.html' then 'text/html; charset=utf-8'
                          when '.css'  then 'text/css; charset=utf-8'
                          when '.js'   then 'application/javascript; charset=utf-8'
                          when '.json' then 'application/json; charset=utf-8'
                          when '.svg'  then 'image/svg+xml'
                          when '.png'  then 'image/png'
                          when '.jpg', '.jpeg' then 'image/jpeg'
                          when '.ico'  then 'image/x-icon'
                          else 'text/plain; charset=utf-8'
                          end
    res.body = File.binread(safe_path)
  else
    res.status = 404
    res['Content-Type'] = 'text/plain'
    res.body = "File not found: #{req.path}"
  end
end

ip = local_ip
puts "=========================================================="
puts "  🕵️  THE MIDNIGHT MANOR MURDER - PARTY INVITATION PORTAL"
puts "=========================================================="
puts "  Local link:    http://localhost:#{PORT}"
puts "  Network link:  http://#{ip}:#{PORT} (for phones on same WiFi!)"
puts "  Host Admin:    http://localhost:#{PORT}/admin.html"
puts "  Host Default PIN: 1920"
puts "=========================================================="
puts "Press Ctrl+C to stop the server."

server.start
