"use strict";
const { Service, Action, Event, Method } = require("moleculer-decorators");
const Moleculer = require("moleculer");
const DbMixin = require("../mixins/db.mixin");

@Service({
	name: 'urls',
	mixins: [DbMixin("urls")],
})
class UrlsService extends Moleculer.Service {
	// Optional constructor
	constructor(...args) {
		super(...args);
	}

	/**
 * 
 * @param {import('moleculer').Context} ctx 
 */
	@Action({
		rest: "GET /funa",
	})
	FunA(ctx) {
		this.logger.info('this is action a ');
		return 'this action a';
	}


	/**
   * 
   * @param {import('moleculer').Context} ctx 
   */
	@Action({
		rest: "GET /funb"
	})
	async FunB(ctx) {
		const funa = this.FunA();
		this.logger.info('fun a', funa);
		const actiona = await this.actions.FunA();
		this.logger.info('action a', actiona);
		return 'this is action b';
	}
}

module.exports = UrlsService;