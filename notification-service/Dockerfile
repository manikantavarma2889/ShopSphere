FROM ruby:3.3-slim

WORKDIR /app

RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential libyaml-dev && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

ENV RAILS_ENV=production
ENV RACK_ENV=production

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
