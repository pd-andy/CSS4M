Audio_Tree = {
  meta: {
    node        : 'meta',
    sample_rate : 44100,
    bpm         : 128,
    timing      : {
      "1/1":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate * 4 
      },
      "1/2":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate * 2 
      },
      "1/3":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate  * 4 / 3
      },
      "1/4":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate 
      },
      "1/6":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate  * 2 / 3
      },
      "1/8":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate / 2 
      },
      "1/12":  () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate / 3
      },
      "1/16": () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate / 4 
      },
      "1/32": () => { 
        return ( 60 / Audio_Tree.meta.bpm ) * Audio_Tree.meta.sample_rate / 8 
      },
    }
  }
}

module.exports = Audio_Tree;