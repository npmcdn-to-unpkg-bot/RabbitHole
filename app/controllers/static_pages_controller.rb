require 'net/http'

class StaticPagesController < ApplicationController
  def index

  end

  def wiki
    uri = URI('https://en.m.wikipedia.org/wiki/' + params[:wiki])
    res = Net::HTTP.get_response(uri)
    render text: res.body
  end
end
