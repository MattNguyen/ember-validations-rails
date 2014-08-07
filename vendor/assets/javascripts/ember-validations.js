// ==========================================================================
// Project:   Ember Validations
// Copyright: Copyright 2013 DockYard, LLC. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


 // Version: 1.0.0

// Copyright: Copyright 2013 DockYard, LLC. and contributors.
!function(){Ember.Validations=Ember.Namespace.create({VERSION:"1.0.0"})}(),function(){Ember.Validations.messages={render:function(t,s){if(Ember.I18n)return Ember.I18n.t("errors."+t,s);var i=new RegExp("{{(.*?)}}"),e="";return i.test(this.defaults[t])&&(e=i.exec(this.defaults[t])[1]),this.defaults[t].replace(i,s[e])},defaults:{inclusion:"is not included in the list",exclusion:"is reserved",invalid:"is invalid",confirmation:"doesn't match {{attribute}}",accepted:"must be accepted",empty:"can't be empty",blank:"can't be blank",present:"must be blank",tooLong:"is too long (maximum is {{count}} characters)",tooShort:"is too short (minimum is {{count}} characters)",wrongLength:"is the wrong length (should be {{count}} characters)",notANumber:"is not a number",notAnInteger:"must be an integer",greaterThan:"must be greater than {{count}}",greaterThanOrEqualTo:"must be greater than or equal to {{count}}",equalTo:"must be equal to {{count}}",lessThan:"must be less than {{count}}",lessThanOrEqualTo:"must be less than or equal to {{count}}",otherThan:"must be other than {{count}}",odd:"must be odd",even:"must be even",url:"is not a valid URL"}}}(),function(){Ember.Validations.Errors=Ember.Object.extend({unknownProperty:function(t){return this.set(t,Ember.makeArray()),this.get(t)}})}(),function(){var t=Ember.Mixin.create({isValid:function(){return 0===this.get("validators").compact().filterBy("isValid",!1).get("length")}.property("validators.@each.isValid"),isInvalid:Ember.computed.not("isValid")}),s=function(t,i){var o=t.get(i);t.removeObserver(i,s),Ember.isArray(o)?t.validators.pushObject(e.create({model:t,property:i,contentBinding:"model."+i})):t.validators.pushObject(o)},i=function(t){var s=t.classify();return Ember.Validations.validators.local[s]||Ember.Validations.validators.remote[s]},e=Ember.ArrayProxy.extend(t,{validate:function(){return this._validate()},_validate:function(){var t=this.get("content").invoke("_validate").without(void 0);return Ember.RSVP.all(t)}.on("init"),validators:Ember.computed.alias("content")});Ember.Validations.Mixin=Ember.Mixin.create(t,{init:function(){this._super(),this.errors=Ember.Validations.Errors.create(),this._dependentValidationKeys={},this.validators=Ember.makeArray(),void 0===this.get("validations")&&(this.validations={}),this.buildValidators(),this.validators.forEach(function(t){t.addObserver("errors.[]",this,function(t){var s=Ember.makeArray();this.validators.forEach(function(i){i.property===t.property&&(s=s.concat(i.errors))},this),this.set("errors."+t.property,s)})},this)},buildValidators:function(){var t;for(t in this.validations)this.validations[t].constructor===Object?this.buildRuleValidator(t):this.buildObjectValidator(t)},buildRuleValidator:function(t){var s;for(s in this.validations[t])this.validations[t].hasOwnProperty(s)&&this.validators.pushObject(i(s).create({model:this,property:t,options:this.validations[t][s]}))},buildObjectValidator:function(t){Ember.isNone(this.get(t))?this.addObserver(t,this,s):s(this,t)},validate:function(){var t=this;return this._validate().then(function(s){var i=t.get("errors");return s.contains(!1)?Ember.RSVP.reject(i):i})},_validate:function(){var t=this.validators.invoke("_validate").without(void 0);return Ember.RSVP.all(t)}.on("init")})}(),function(){Ember.Validations.patterns=Ember.Namespace.create({numericality:/^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/,blank:/^\s*$/})}(),function(){Ember.Validations.validators=Ember.Namespace.create(),Ember.Validations.validators.local=Ember.Namespace.create(),Ember.Validations.validators.remote=Ember.Namespace.create()}(),function(){Ember.Validations.validators.Base=Ember.Object.extend({init:function(){this.set("errors",Ember.makeArray()),this._dependentValidationKeys=Ember.makeArray(),this.conditionals={"if":this.get("options.if"),unless:this.get("options.unless")},this.model.addObserver(this.property,this,this._validate)},addObserversForDependentValidationKeys:function(){this._dependentValidationKeys.forEach(function(t){this.model.addObserver(t,this,this._validate)},this)}.on("init"),pushDependentValidationKeyToModel:function(){var t=this.get("model");void 0===t._dependentValidationKeys[this.property]&&(t._dependentValidationKeys[this.property]=Ember.makeArray()),t._dependentValidationKeys[this.property].addObjects(this._dependentValidationKeys)}.on("init"),call:function(){throw"Not implemented!"},unknownProperty:function(t){var s=this.get("model");return s?s.get(t):void 0},isValid:Ember.computed.empty("errors.[]"),validate:function(){var t=this;return this._validate().then(function(s){var i=t.get("model.errors");return s?i:Ember.RSVP.reject(i)})},_validate:function(){return this.errors.clear(),this.canValidate()&&this.call(),this.get("isValid")?Ember.RSVP.resolve(!0):Ember.RSVP.resolve(!1)}.on("init"),canValidate:function(){if("object"!=typeof this.conditionals)return!0;if(this.conditionals["if"]){if("function"==typeof this.conditionals["if"])return this.conditionals["if"](this.model,this.property);if("string"==typeof this.conditionals["if"])return"function"==typeof this.model[this.conditionals["if"]]?this.model[this.conditionals["if"]]():this.model.get(this.conditionals["if"])}else{if(!this.conditionals.unless)return!0;if("function"==typeof this.conditionals.unless)return!this.conditionals.unless(this.model,this.property);if("string"==typeof this.conditionals.unless)return"function"==typeof this.model[this.conditionals.unless]?!this.model[this.conditionals.unless]():!this.model.get(this.conditionals.unless)}}})}(),function(){Ember.Validations.validators.local.Absence=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options===!0&&this.set("options",{}),void 0===this.options.message&&this.set("options.message",Ember.Validations.messages.render("present",this.options))},call:function(){Ember.isEmpty(this.model.get(this.property))||this.errors.pushObject(this.options.message)}})}(),function(){Ember.Validations.validators.local.Acceptance=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options===!0&&this.set("options",{}),void 0===this.options.message&&this.set("options.message",Ember.Validations.messages.render("accepted",this.options))},call:function(){this.options.accept?this.model.get(this.property)!==this.options.accept&&this.errors.pushObject(this.options.message):"1"!==this.model.get(this.property)&&1!==this.model.get(this.property)&&this.model.get(this.property)!==!0&&this.errors.pushObject(this.options.message)}})}(),function(){Ember.Validations.validators.local.Confirmation=Ember.Validations.validators.Base.extend({init:function(){this.originalProperty=this.property,this.property=this.property+"Confirmation",this._super(),this._dependentValidationKeys.pushObject(this.originalProperty),this.options===!0&&(this.set("options",{attribute:this.originalProperty}),this.set("options",{message:Ember.Validations.messages.render("confirmation",this.options)}))},call:function(){this.model.get(this.originalProperty)!==this.model.get(this.property)&&this.errors.pushObject(this.options.message)}})}(),function(){Ember.Validations.validators.local.Exclusion=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options.constructor===Array&&this.set("options",{"in":this.options}),void 0===this.options.message&&this.set("options.message",Ember.Validations.messages.render("exclusion",this.options))},call:function(){var t,s;Ember.isEmpty(this.model.get(this.property))?void 0===this.options.allowBlank&&this.errors.pushObject(this.options.message):this.options["in"]?-1!==Ember.$.inArray(this.model.get(this.property),this.options["in"])&&this.errors.pushObject(this.options.message):this.options.range&&(t=this.options.range[0],s=this.options.range[1],this.model.get(this.property)>=t&&this.model.get(this.property)<=s&&this.errors.pushObject(this.options.message))}})}(),function(){Ember.Validations.validators.local.Format=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options.constructor===RegExp&&this.set("options",{"with":this.options}),void 0===this.options.message&&this.set("options.message",Ember.Validations.messages.render("invalid",this.options))},call:function(){Ember.isEmpty(this.model.get(this.property))?void 0===this.options.allowBlank&&this.errors.pushObject(this.options.message):this.options["with"]&&!this.options["with"].test(this.model.get(this.property))?this.errors.pushObject(this.options.message):this.options.without&&this.options.without.test(this.model.get(this.property))&&this.errors.pushObject(this.options.message)}})}(),function(){Ember.Validations.validators.local.Inclusion=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options.constructor===Array&&this.set("options",{"in":this.options}),void 0===this.options.message&&this.set("options.message",Ember.Validations.messages.render("inclusion",this.options))},call:function(){var t,s;Ember.isEmpty(this.model.get(this.property))?void 0===this.options.allowBlank&&this.errors.pushObject(this.options.message):this.options["in"]?-1===Ember.$.inArray(this.model.get(this.property),this.options["in"])&&this.errors.pushObject(this.options.message):this.options.range&&(t=this.options.range[0],s=this.options.range[1],(this.model.get(this.property)<t||this.model.get(this.property)>s)&&this.errors.pushObject(this.options.message))}})}(),function(){Ember.Validations.validators.local.Length=Ember.Validations.validators.Base.extend({init:function(){var t,s;for(this._super(),"number"==typeof this.options&&this.set("options",{is:this.options}),void 0===this.options.messages&&this.set("options.messages",{}),t=0;t<this.messageKeys().length;t++)s=this.messageKeys()[t],void 0!==this.options[s]&&this.options[s].constructor===String&&this.model.addObserver(this.options[s],this,this._validate);this.options.tokenizer=this.options.tokenizer||function(t){return t.split("")}},CHECKS:{is:"==",minimum:">=",maximum:"<="},MESSAGES:{is:"wrongLength",minimum:"tooShort",maximum:"tooLong"},getValue:function(t){return this.options[t].constructor===String?this.model.get(this.options[t])||0:this.options[t]},messageKeys:function(){return Ember.keys(this.MESSAGES)},checkKeys:function(){return Ember.keys(this.CHECKS)},renderMessageFor:function(t){var s,i={count:this.getValue(t)};for(s in this.options)i[s]=this.options[s];return this.options.messages[this.MESSAGES[t]]||Ember.Validations.messages.render(this.MESSAGES[t],i)},renderBlankMessage:function(){return this.options.is?this.renderMessageFor("is"):this.options.minimum?this.renderMessageFor("minimum"):void 0},call:function(){var t,s,i;if(Ember.isEmpty(this.model.get(this.property)))void 0===this.options.allowBlank&&(this.options.is||this.options.minimum)&&this.errors.pushObject(this.renderBlankMessage());else for(i in this.CHECKS)s=this.CHECKS[i],this.options[i]&&(t=new Function("return "+this.options.tokenizer(this.model.get(this.property)).length+" "+s+" "+this.getValue(i)),t()||this.errors.pushObject(this.renderMessageFor(i)))}})}(),function(){Ember.Validations.validators.local.Numericality=Ember.Validations.validators.Base.extend({init:function(){var t,s,i;for(this._super(),this.options===!0?this.options={}:this.options.constructor===String&&(i=this.options,this.options={},this.options[i]=!0),(void 0===this.options.messages||void 0===this.options.messages.numericality)&&(this.options.messages=this.options.messages||{},this.options.messages={numericality:Ember.Validations.messages.render("notANumber",this.options)}),void 0!==this.options.onlyInteger&&void 0===this.options.messages.onlyInteger&&(this.options.messages.onlyInteger=Ember.Validations.messages.render("notAnInteger",this.options)),s=Ember.keys(this.CHECKS).concat(["odd","even"]),t=0;t<s.length;t++){i=s[t];var e=this.options[i];i in this.options&&isNaN(e)&&this.model.addObserver(e,this,this._validate),void 0!==e&&void 0===this.options.messages[i]&&(-1!==Ember.$.inArray(i,Ember.keys(this.CHECKS))&&(this.options.count=e),this.options.messages[i]=Ember.Validations.messages.render(i,this.options),void 0!==this.options.count&&delete this.options.count)}},CHECKS:{equalTo:"===",greaterThan:">",greaterThanOrEqualTo:">=",lessThan:"<",lessThanOrEqualTo:"<="},call:function(){var t,s,i,e;if(Ember.isEmpty(this.model.get(this.property)))void 0===this.options.allowBlank&&this.errors.pushObject(this.options.messages.numericality);else if(Ember.Validations.patterns.numericality.test(this.model.get(this.property)))if(this.options.onlyInteger!==!0||/^[+\-]?\d+$/.test(this.model.get(this.property)))if(this.options.odd&&parseInt(this.model.get(this.property),10)%2===0)this.errors.pushObject(this.options.messages.odd);else if(this.options.even&&parseInt(this.model.get(this.property),10)%2!==0)this.errors.pushObject(this.options.messages.even);else for(t in this.CHECKS)e=this.CHECKS[t],void 0!==this.options[t]&&(!isNaN(parseFloat(this.options[t]))&&isFinite(this.options[t])?s=this.options[t]:void 0!==this.model.get(this.options[t])&&(s=this.model.get(this.options[t])),i=new Function("return "+this.model.get(this.property)+" "+e+" "+s),i()||this.errors.pushObject(this.options.messages[t]));else this.errors.pushObject(this.options.messages.onlyInteger);else this.errors.pushObject(this.options.messages.numericality)}})}(),function(){Ember.Validations.validators.local.Presence=Ember.Validations.validators.Base.extend({init:function(){this._super(),this.options===!0&&(this.options={}),void 0===this.options.message&&(this.options.message=Ember.Validations.messages.render("blank",this.options))},call:function(){Ember.isEmpty(this.model.get(this.property))&&this.errors.pushObject(this.options.message)}})}(),function(){Ember.Validations.validators.local.Url=Ember.Validations.validators.Base.extend({regexp:null,regexp_ip:null,init:function(){this._super(),void 0===this.get("options.message")&&this.set("options.message",Ember.Validations.messages.render("url",this.options)),void 0===this.get("options.protocols")&&this.set("options.protocols",["http","https"]);var t="(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])",s="("+t+"(\\."+t+"){3})",i="([a-zA-Z0-9\\-]+\\.)+([a-zA-Z]{2,})",e="%[0-9a-fA-F]{2}",o="a-zA-Z0-9$\\-_.+!*'(),;:@&=",n="(["+o+"]|"+e+")*",r="^";this.get("options.domainOnly")===!0?r+=i:(r+="("+this.get("options.protocols").join("|")+"):\\/\\/",this.get("options.allowUserPass")===!0&&(r+="(([a-zA-Z0-9$\\-_.+!*'(),;:&=]|"+e+")+@)?"),r+=this.get("options.allowIp")===!0?"("+i+"|"+s+")":"("+i+")",this.get("options.allowPort")===!0&&(r+="(:[0-9]+)?"),r+="(\\/",r+="("+n+"(\\/"+n+")*)?",r+="(\\?(["+o+"/?]|"+e+")*)?",r+="(\\#(["+o+"/?]|"+e+")*)?",r+=")?"),r+="$",this.regexp=new RegExp(r),this.regexp_ip=new RegExp(s)},call:function(){var t=this.model.get(this.property);if(Ember.isEmpty(t))this.get("options.allowBlank")!==!0&&this.errors.pushObject(this.get("options.message"));else{if(this.get("options.allowIp")!==!0&&this.regexp_ip.test(t))return this.errors.pushObject(this.get("options.message")),void 0;this.regexp.test(t)||this.errors.pushObject(this.get("options.message"))}}})}(),"undefined"==typeof location||"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname||Ember.Logger.warn("You are running a production build of Ember on localhost and won't receive detailed error messages. If you want full error messages please use the non-minified build provided on the Ember website.");
