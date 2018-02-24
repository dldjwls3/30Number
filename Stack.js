function Stack() {
    this.storage = {};
    this.size = 0;
}

Stack.prototype.push = function(data) {
    this.storage[this.size] = data;
    this.size++;
};

Stack.prototype.pop = function() {
    if(this.size > 0) {
        this.size--;
        let data = this.storage[this.size];
        delete this.storage[this.size];
        return data;
    }
    else {
        return null;
    }
};

Stack.prototype.head = function() {
    return this.storage[this.size-1];
};

Stack.prototype.empty = function() {
    return this.size === 0;
};

module.exports = Stack;