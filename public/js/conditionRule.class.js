class conditionRule {
    constructor(condition, comparison, value) {
        this.condition = condition;
        this.comparison = comparison;
        this.value = value;
    }

    /**
     * Checks if a conditionRule is met.
     * 
     * @param conditionRule conditionRule
     */
    check() {
        let value = window.Popbot.condition.get(this.condition);

        switch (this.comparison) {
            case "not_equals":
                return value != this.value;
                return false;
                break;

            case "less_than":
                return parseFloat(value) < parseFloat(this.value);
                return false;
                break;

            case "greater_than":
                return parseFloat(value) > parseFloat(this.value);
                return false;
                break;

            case "contains":
                return value.includes(this.value);
                return false;
                break;

            case "not_contains":
                return !value.includes(this.value);
                return false;
                break;

            default:
            case "equals":
                return value == this.value;
                break;
        }
    }
}