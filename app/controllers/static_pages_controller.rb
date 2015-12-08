require 'net/http'

class StaticPagesController < ApplicationController
  def index

  end

  def wiki
    search_term = params[:wiki].force_encoding("UTF-8")
    uri = 'https://en.m.wikipedia.org/wiki/' + URI.escape(search_term)
    res = Net::HTTP.get_response(uri)
    render text: res.body
  end
end
