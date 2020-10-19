"use strict";
const { Service, Action, Event, Method } = require("moleculer-decorators");
const Moleculer = require("moleculer");
const DbMixin = require("../mixins/db.mixin");

@Service({
	name: 'products',
	// constructOverride: false,
	// skipHandler: true,
	// version: 1,
	/**
 * Mixins
 */
	mixins: [DbMixin("products")],
	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"name",
			"quantity",
			"price"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive"
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx) {
				ctx.params.quantity = 0;
			}
		}
	},
})
class ProductsService extends Moleculer.Service {
	// Optional constructor
	// constructor(...args) {
	// 	// console.log('args', args);
	// 	super(...args);
	// 	// this.settings = {
	// 	// 	name: "products"
	// 	// };
	// }

	/**
	 * The "moleculer-db" mixin registers the following actions:
	 *  - list
	 *  - find
	 *  - count
	 *  - create
	 *  - insert
	 *  - update
	 *  - remove
	 */
	@Action({
		rest: "PUT /:id/quantity/increase",
		params: {
			id: "string",
			value: "number|integer|positive"
		},
	})
	// --- ADDITIONAL ACTIONS ---
	async increaseQuantity(ctx) {
		const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: ctx.params.value } });
		const json = await this.transformDocuments(ctx, ctx.params, doc);
		await this.entityChanged("updated", json, ctx);

		return json;
	}
	
	@Action({
		rest: "PUT /:id/quantity/decrease",
		params: {
			id: "string",
			value: "number|integer|positive"
		},
	})
	async decreaseQuantity(ctx) {
		const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: -ctx.params.value } });
		const json = await this.transformDocuments(ctx, ctx.params, doc);
		await this.entityChanged("updated", json, ctx);

		return json;
	}
	/**
	 * Loading sample data to the collection.
	 * It is called in the DB.mixin after the database
	 * connection establishing & the collection is empty.
	 */
	@Method
	async seedDB() {
		await this.adapter.insertMany([
			{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
			{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
			{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
		]);
	}

	/**
 * Fired after database connection establishing.
 */
	// @Event()
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
}

module.exports = ProductsService;