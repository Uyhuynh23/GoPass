// Base Repository class for common CRUD operations
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    const { sort, limit, skip, populate } = options;
    let query = this.model.find(filter);

    if (sort) query = query.sort(sort);
    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);
    if (populate) query = query.populate(populate);

    return await query;
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateOne(filter, data) {
    return await this.model.findOneAndUpdate(filter, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteOne(filter) {
    return await this.model.findOneAndDelete(filter);
  }

  async deleteMany(filter) {
    return await this.model.deleteMany(filter);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter) {
    return await this.model.exists(filter);
  }
}

module.exports = BaseRepository;
