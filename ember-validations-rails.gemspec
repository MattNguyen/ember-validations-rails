# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'ember/validations/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "ember-validations-rails"
  spec.version       = Ember::Validations::Rails::VERSION
  spec.authors       = ["Gigha"]
  spec.email         = ["girgis@ghattas.nl"]
  spec.summary       = "Ember-validation for Rails"
  spec.description   = "Ember-validations packaged for the Rails asset pipeline"
  spec.homepage      = "https://github.com/Gigha/ember-validations-rails"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.5"
  spec.add_development_dependency "rake"
  spec.add_dependency "railties"
end
