
const Course = ( { course } ) => {
    return (
        <div>
            <Title course={ course }/>
            <Header course={ course }/>
            <Content course={ course }/>
            <Total course={ course }/>
        </div>
      )
}

const Title = ( { course } ) => {
    return (
        <h1>{ course.title }</h1>
    )
}
const Header = ( { course } ) => {
    return (
        <h2>{ course.name }</h2>
    )
}

const Content = ( { course } ) => {
    return (
        <div>
          { course.parts.map( part => 
            <Part key={ part.id } part={ part }/>  
           ) }     
        </div>
      )
}

const Total = (  { course } ) => {
    var totalAmount = course.parts.reduce( ( s,p ) =>  s + p.exercises , 0 )
    return (
        <h4>
          total of { totalAmount } exercises
        </h4> 
    )
}

const Part = ( props ) => {
    return (
        <p>
          { props.part.name } { props.part.exercises} 
        </p> 
    )
}

export default Course