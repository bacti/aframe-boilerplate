const _ = require('underscore')
const SegmentTree = require('./SegmentTree')

const PADDING = 1
const ACCEPTED_EFFICIENCY = { MIN: 0, MAX: 0.9 }
const ACCEPTED_TIMEOUT = 10000
const ACCEPTED_SIZE = 2048 * 2048 * 0.8

module.exports =
class RectanglePacking
{
    constructor(sample)
    {
        this.groups = []
        let groupIndex = -1
        _.reduce(sample, (area, rect) =>
        {
            if (area + rect.w * rect.h < ACCEPTED_SIZE)
            {
                this.groups[groupIndex].rects.push(rect)
                this.groups[groupIndex].area += rect.w * rect.h
            }
            else
            {
                this.groups[++groupIndex] =
                {
                    area: rect.w * rect.h,
                    rects: [ rect ],
                }
            }
            return this.groups[groupIndex].area
        }, Number.MAX_SAFE_INTEGER)
    }

    Proceed()
    {
        this.start = _.now()
        this.groups.map((group, groupIndex) =>
        {
            group.start = _.now()
            group.elapse = 0
            group.MAX_SIZE = Math.floor(Math.sqrt(group.area * 2))
            group.MAX_ATTEMPT = Math.floor(Math.pow(Math.E, Math.log(Math.pow(2, 31)) / group.rects.length)) // ensure the number of recursion does not exceed 2^31
            group.rects = _.sortBy(group.rects, rect => -rect.w * rect.h)
            group.solution = [ Number.MIN_SAFE_INTEGER ]
            group.tree = new SegmentTree(group.MAX_SIZE)
            this.LeastBound(group, 0, [])
        })
        // console.log(`finished in ${_.now() - this.start}ms`)
    }

    Verify(group, node, weight, size, results)
    {
        if (node.position + size > group.MAX_SIZE)
            return
        if (node.left)
        {
            this.Verify(group, node.left, weight, size, results)
            this.Verify(group, node.right, weight, size, results)
        }
        else
        if (node.size > 0)
        {
            group.tree.Append(weight, node.position, size)
            let efficiency = group.tree.root.volume / (group.tree.root.max * group.tree.root.measure)
            if (results[`${efficiency}`] == undefined || results[`${efficiency}`].base > node.max - weight)
            {
                results[`${efficiency}`] =
                {
                    position: node.position,
                    base: node.max - weight,
                }
            }
            group.tree.Crop(weight, node.position, size)
        }
    }
    
    LeastBound(group, counter, sequence)
    {
        if (group.solution[0] >= ACCEPTED_EFFICIENCY.MAX || group.tree.root.max > group.MAX_SIZE * 3)
            return
    
        let efficiency = group.tree.root.volume / (group.tree.root.max * group.tree.root.measure)
        if (efficiency < ACCEPTED_EFFICIENCY.MIN)
            return
    
        if (group.elapse > ACCEPTED_TIMEOUT)
            return
        group.elapse = _.now() - group.start

        if (counter == group.rects.length)
        {
            if (efficiency > group.solution[0])
            {
                group.solution = _.clone(sequence)
                group.solution.splice(0, 0, efficiency, group.tree.root.measure, group.tree.root.max)
                // console.log(efficiency, group.tree.root.measure, group.elapse)
            }
        }
        else
        {
            let results = {}
            this.Verify(group, group.tree.root, group.rects[counter].h + PADDING, group.rects[counter].w + PADDING, results)
            results = _.sortBy(results, (_, efficiency) => -parseFloat(efficiency))
            results.slice(0, group.MAX_ATTEMPT).forEach(result =>
            {
                sequence.push({ index: group.rects[counter].index, x: result.position, y: result.base })
                group.tree.Append(group.rects[counter].h + PADDING, result.position, group.rects[counter].w + PADDING)
                this.LeastBound(group, counter + 1, sequence)
                group.tree.Crop(group.rects[counter].h + PADDING, result.position, group.rects[counter].w + PADDING)
                sequence.pop()
            })
        }
    }
}
